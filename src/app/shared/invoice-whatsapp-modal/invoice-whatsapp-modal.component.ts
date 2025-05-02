import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { InvoiceService } from 'src/app/providers/services/invoice.service';
import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-invoice-whatsapp-modal',
  templateUrl: './invoice-whatsapp-modal.component.html',
  styleUrls: ['./invoice-whatsapp-modal.component.scss']
})
export class InvoiceWhatsappModalComponent implements OnInit {

  recordData: any;
  isOnItEvent: boolean = false;
  loginSuccessSubscription: Subscription;
  invType: any;
  type: any;
  ledgers: any = [];
  isBtnLoading: boolean = false;
  form: FormGroup;
  isPrintBtnLoading: boolean = false;
  @Input() public data;
  userData: any = {};
  selectedFiles: File[] = [];
  setupInfoData: any;
  isSubmitted: boolean = false;
  sessionId: any;
  private key = '5ad16afb-0cbc-4636-ad55-97f1ac91ae45';
  currentCompany: ICompanyViewModel;

  constructor(
    private companyResolver: CompanyResolver,
    private invoiceService: InvoiceService,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageServiceService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authServiceService: AuthServiceService,) {
    this.currentCompany = companyResolver.getCurrentCompany();
    var token = this.authServiceService.getTokenInfo();
    this.sessionId = token.user.currentSessionId;
    this.getUserData();
    this.createForm();
  }

  ngOnInit(): void {
    this.setupInfoData = this.data.setupInfoData;
    this.invType = this.data.invType;
    this.type = this.data.type;
    this.recordData = this.data.recordData;
    this.selectToEmail(this.recordData.ledger_ID);
    //this.onPrint();
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
      this.form.patchValue({ mobile: obj.mobile, name: obj.name });
    }
  }

  createForm() {
    this.form = this.fb.group({
      id: [],
      mobile: [null, [this.validatePhone()]],
      name: [null],
    });
  }

  validatePhone(): { [key: string]: any } | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value && control.value.length != 10) {
        return { 'phoneNumberInvalid': true };
      }
      return null;
    }
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

  async send() {
    if (this.form.invalid) {
      return;
    } else {

      const dateObject = new Date(this.recordData.date);
      const formattedDate = `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;

      var text = `${appCommon.InvoiceVoucherTypesObjByte[this.invType]}
*${this.form.value.name}*
Bill Number: ${this.recordData.bill_No}
Date: ${formattedDate}
Amount: ${this.FormatNumberVal(this.recordData.grandTotal)}

Document Link: ${`https://erp.abssoftware.in/#/print/invoice?printCode=${this.shortenUrl()}`}`;

      const url = `https://web.whatsapp.com/send?phone=${this.form.value.mobile}&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');

      this.activeModal.dismiss();
    }
  }
  //Document Link: ${await this.invoiceService.shortenUrlString(`http://localhost:4200/#/print/invoice?printCode=${this.shortenUrl()}`).toPromise()}

  previewFile(file: File) {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  }

  FormatNumberVal(params: any) {
    return appCommon.FormatValueBasedOnPrecision(params, this.authServiceService);
  }

  shortenUrl(): string {
    var rec = null;
    if (this.setupInfoData && this.setupInfoData.printReports && this.setupInfoData.printReports.length) {
      rec = this.setupInfoData.printReports.filter(x => x.isDefault && !x.isVoucher, true)[0];
    }
    const dataToEncrypt = `printCode=${this.data.printCode}&companyId=${this.currentCompany.id}`;
    const base64 = btoa(dataToEncrypt);
    return base64.replace(/[^a-zA-Z0-9]/g, '');
  }


}

