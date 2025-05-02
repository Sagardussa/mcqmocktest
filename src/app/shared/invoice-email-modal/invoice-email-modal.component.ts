import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { InvoiceService } from 'src/app/providers/services/invoice.service';
import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { SalesPersonService } from 'src/app/providers/services/sales-person.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-invoice-email-modal',
  templateUrl: './invoice-email-modal.component.html',
  styleUrls: ['./invoice-email-modal.component.scss']
})
export class InvoiceEmailModalComponent implements OnInit {

  recordData: any;
  isOnItEvent: boolean = false;
  loginSuccessSubscription: Subscription;
  invType: any;
  setupInfoData: any;
  ledgers: any = [];
  isBtnLoading: boolean = false;
  form: FormGroup;
  isPrintBtnLoading: boolean = false;
  @Input() public data;
  userData: any = {};
  selectedFiles: File[] = [];
  currentCompany: ICompanyViewModel;

  constructor(
    private salesPersonService: SalesPersonService,
    private invoiceService: InvoiceService,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageServiceService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authServiceService: AuthServiceService,
    private companyResolver: CompanyResolver,
  ) {
    this.currentCompany = companyResolver.getCurrentCompany();
    this.getUserData();
    this.createForm();
  }

  ngOnInit(): void {

    this.setupInfoData = this.data.setupInfoData;
    this.invType = this.data.invType;
    this.recordData = this.data.recordData;

    this.selectToEmail(this.recordData.ledger_ID);
    this.selectSubject();
    this.selectMessage();

    this.onPrint();
  }

  getUserData() {
    this.userData = this.authServiceService.getTokenInfo().user;
  }

  ngOnDestroy(): void {
  }

  selectToEmail(ledgerId: number) {
    this.ledgers = this.localStorageService.getItem(appCommon.LocalStorageKeyType.LedgerList);
    var obj = this.ledgers.filter((x: any) => x.id == ledgerId, true)[0];

    if (obj) {
      this.form.patchValue({ to: obj.email });
      if (obj.assignedUserId) this.selectCCEmail(obj.assignedUserId);
    }
  }

  async selectCCEmail(salesPersonId: number) {
    var obj = await this.salesPersonService.Get({ id: salesPersonId }).toPromise();
    if (obj) this.form.patchValue({ cc: obj.email_ID });
  }


  selectSubject() {
    let emailSubject = this.setupInfoData.emailSubject;
    if (emailSubject && emailSubject.indexOf(appCommon.PlaceHolders.billNo) != -1) {
      emailSubject = emailSubject.replace(appCommon.PlaceHolders.billNo, this.recordData.bill_No);
    }
    if (emailSubject) {
      this.form.patchValue({ subject: emailSubject });
    } else {
      this.form.patchValue({ subject: `${this.currentCompany.compName} ${this.recordData.bill_No} - ${moment(this.recordData.date).format('DD/MM/YYYY ' + 'hh:mm A')}` });
    }
  }

  selectMessage() {
    let emailMessage = this.setupInfoData.emailMessage;
    if (emailMessage && emailMessage.indexOf(appCommon.PlaceHolders.partyName) != -1) {
      emailMessage = emailMessage.replace(appCommon.PlaceHolders.partyName, this.recordData.partyName);
    }
    if (emailMessage && emailMessage.indexOf(appCommon.PlaceHolders.billNo) != -1) {
      emailMessage = emailMessage.replace(appCommon.PlaceHolders.billNo, this.recordData.bill_No);
    }
    if (emailMessage && emailMessage.indexOf(appCommon.PlaceHolders.grandTotal) != -1) {
      emailMessage = emailMessage.replace(appCommon.PlaceHolders.grandTotal, this.recordData.grandTotal);
    }
    if (emailMessage && emailMessage.indexOf(appCommon.PlaceHolders.companyName) != -1) {
      emailMessage = emailMessage.replace(appCommon.PlaceHolders.companyName, this.currentCompany.compName);
    }
    if (emailMessage) {
      this.form.patchValue({ message: emailMessage });
    } else {
      this.form.patchValue({
        message: `Dear Sir/Madam,
  
  Kindly find the ${this.recordData.bill_No} attached.
  Thank you for your business.
  
  Regards,
  ${this.currentCompany.compName}`
      });
    }
  }

  createForm() {
    this.form = this.fb.group({
      id: [],
      from: [this.userData ? this.userData.email_ID : null, [Validators.email]],
      to: [null],
      cc: [null],
      // bcc: [null, [Validators.email]],
      //attachment: [null],
      subject: [null],
      message: [null],
      file: [File],
    });
  }

  passBack() {
    this.activeModal.close();
  }

  onPrint() {
    if (this.setupInfoData && this.setupInfoData.printReports && this.setupInfoData.printReports.length) {
      var rec = this.setupInfoData.printReports.filter(x => x.isDefault, true)[0];
      if (rec) {
        this.isPrintBtnLoading = true;
        var fdata = {
          id: this.recordData.invCode,
          invType: this.setupInfoData.invTypeId,
          reportName: rec.fileName.replace("\\", "")
        };
        this.invoiceService.PrintInvoice(fdata)
          .subscribe(response => {

            this.isPrintBtnLoading = false;

            //const contentType = response.headers.get('Content-Type');
            const contentDisposition = response.headers.get('Content-Disposition');

            // extract the filename from the content disposition header, if available
            let filename = '';
            if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              const matches = filenameRegex.exec(contentDisposition);
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
              }
            }

            // read the blob content
            const blob = response.body as Blob;

            // do something with the blob content and filename, if available
            this.selectedFiles.push(new File([blob], filename, { type: blob.type }));
          }, async error => {
            this.isPrintBtnLoading = false;
            const temp = await (new Response(error)).json();
            this.toastrMessageService.showInfo(temp.Message, "Info");
          });
      } else { alert('No default report found for print.') }
    } else { alert('No report found for print.') };
  }

  get formData() { return this.form.controls; }

  onFileChange(event) {
    this.selectedFiles.push(event.target.files[0]);
    const inputElement = document.getElementById('file') as HTMLInputElement;
    inputElement.value = '';
  }

  removeFile(i: number) {
    if (!confirm("Do you want delete?")) return;
    this.selectedFiles.splice(i, 1);
  }

  send() {
    if (this.form.invalid) {
      return;
    }
    else {
      this.isBtnLoading = true;
      const formData = new FormData();

      formData.append('from', this.formData.from.value);
      formData.append('to', this.formData.to.value);
      formData.append('cc', this.formData.cc.value);
      formData.append('subject', this.formData.subject.value);
      formData.append('message', this.formData.message.value);
      for (const file of this.selectedFiles) {
        formData.append('files', file);
      }
      this.invoiceService.SendEmail(formData)
        .subscribe(data => {
          this.isBtnLoading = false;
          this.toastrMessageService.showSuccess('Email send successfully.', 'Success');
          this.passBack();
        }, error => {
          this.isBtnLoading = false;
          this.toastrMessageService.showInfo(error.message ? error.message : error, "Info");
        });
    }
  }

  previewFile(file: File) {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  }

  replacePlaceholders(text: string): string {
    for (const [placeholder, key] of Object.entries(appCommon.PlaceHolders)) {
      if (text.includes(placeholder) && this.recordData[key]) {
        text = text.replace(new RegExp(placeholder, 'g'), this.recordData[key]);
      }
    }
    return text;
  }
}