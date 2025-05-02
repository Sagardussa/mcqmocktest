import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { Subscription } from 'rxjs';
// import { appCommon } from 'src/app/common/_appCommon';
// import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';
// import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
// import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
// import { UserService } from 'src/app/providers/services/user.service';
// import { VoucherService } from 'src/app/providers/services/voucher.service';

@Component({
  selector: 'app-voucher-details-modal',
  templateUrl: './voucher-details-modal.component.html',
  styleUrls: ['./voucher-details-modal.component.scss']
})
export class VoucherDetailsModalComponent implements OnInit {
  isBtnLoading: boolean = false;
  isSubmitted: boolean = false;
  recordData: any = {};
  isOnItEvent: boolean = false;
  // loginSuccessSubscription: Subscription;
  invType: any;
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  // public appCommon = appCommon;
  setupInfoData: any;
  ledgers: any = [];
  isDataLoading: boolean = false;
  invTypeText: any;
  salesmanList: any = [];
  salesPerson: any;
  // form: FormGroup;
  isPrintBtnLoading: boolean = false;
  // @Input() public data;
  userList: any = [];
  // isFromInv: boolean;
  constructor(
    private router: Router,
  ) {
    // this.getuserList();
    // this.loginSuccessSubscription = recordCreationService.loginSuccessEventChanged$.subscribe(() => {
    //   if (this.isOnItEvent) {
    //     this.getVoucherData(this.recordData.invCode);
    //   }
    // });
    // this.createForm();
  }

  ngOnInit(): void {
    // this.loadLedgers();
    // this.isOnItEvent = true;
    // this.setupInfoData = this.data.setupInfoData;
    // this.invType = this.data.invType;
    // this.invTypeText = appCommon.VoucherTypesObjByte[this.invType];
    // this.recordData = this.data.recordData;
    // this.isFromInv = this.data.isFromInv;
    // this.getVoucherData(this.recordData.invCode);
  }

  // ngOnDestroy(): void {
  //   this.loginSuccessSubscription.unsubscribe();
  // }

  // getVoucherData(id: number): void {
  //   this.isDataLoading = true;
  //   var fdata = { id: id, invType: this.invType, fromInvoice: true };

  //   // this.voucherService.Get(fdata)
  //   //   .subscribe(
  //   //     data => {
  //   //       this.recordData = data;

  //   //       this.recordData.ledgerDetails.forEach(v => {
  //   //         v.ledgerData = this.ledgers.filter((x: any) => x.id == v.ledger_ID, true)[0];

  //   //         v.subDetails.forEach(v1 => {
  //   //           v1.subDetail_Type = appCommon.EnSubDetailType.filter(x => x.id == v1.subDetail_Type)[0];
  //   //         });
  //   //       });

  //   //       if (this.recordData.loginByUserID && this.userList.length) {
  //   //         this.setPrepareBy();
  //   //       }

  //   //       this.isOnItEvent = false;
  //   //       this.isDataLoading = false;
  //   //     },
  //   //     error => {
  //   //       this.toastrMessageService.showInfo(error.message ? error.message : error, "Info");
  //   //     });
  // }

  // notesForm(item: any) {
  //   return this.fb.group({
  //     title: [item.title ? item.title : null],
  //     note: [item.note ? item.note : null]
  //   });
  // }

  // createForm() {
  //   this.form = this.fb.group({
  //   });
  // }

  // loadLedgers() {
  //   this.ledgers = this.localStorageService.getItem(
  //     appCommon.LocalStorageKeyType.LedgerList
  //   );
  // }

  // okDialog() {
  //   this.closeDialog([]);
  // }

  // cancelDialog() {
  //   this.closeDialog([]);
  // }
  // closeDialog(data: any): void {
  //   this.activeModal.close({ data: data })
  // }


  // passBack() {
  //   this.activeModal.close();
  // }

  // onPrint() {
  //   if (this.setupInfoData && this.setupInfoData.printReports && this.setupInfoData.printReports.length) {
  //     var rec = this.setupInfoData.printReports.filter(x => x.isDefault, true)[0];
  //     if (rec) {
  //       this.isPrintBtnLoading = true;
  //       var fdata = {
  //         id: this.recordData.id,
  //         invType: this.setupInfoData.invTypeId,
  //         reportName: rec.fileName.replace("\\", "")
  //       };
  //       // this.voucherService.PrintVoucher(fdata)
  //       //   .subscribe((response: Blob) => {
  //       //     this.isPrintBtnLoading = false;
  //       //     const link = document.createElement('a');
  //       //     link.href = window.URL.createObjectURL(response);
  //       //     link.target = '_blank';
  //       //     document.body.appendChild(link);
  //       //     link.click();
  //       //     document.body.removeChild(link);
  //       //   }, async error => {
  //       //     this.isPrintBtnLoading = false;
  //       //     const temp = await (new Response(error)).json();
  //       //     this.toastrMessageService.showInfo(temp.Message, "Info");
  //       //   });
  //     } else { alert('No default report found for print.') }
  //   } else { alert('No report found for print.') };
  // }

  // getuserList() {
  //   var fdata = {};
  //   this.userService
  //     .Search(fdata)
  //     .subscribe(
  //       data => {
  //         this.userList = data.list;

  //         if (this.userList.length && this.recordData.loginByUserID) {
  //           this.setPrepareBy();
  //         }
  //       },
  //       error => {
  //         this.toastrMessageService.showInfo(error.error.message, "Info");
  //       });
  // }

  // setPrepareBy() {
  //   var user = this.userList.filter((x: any) => x.user_ID == this.recordData.loginByUserID, true)[0];
  //   if (user) this.recordData.preparedBy = user.first_Name + ' ' + user.lastname;
  // }

  // onEdit() {
  //   const editUrl = 'voucher/' + appCommon.InvoiceVoucherTypesReverseObj[this.invType] + "/edit/" + this.recordData.id;
  //   if (this.isFromInv) {
  //     this.router.navigate([editUrl]);
  //     this.passBack();
  //   } else {
  //     window.open('#/' + editUrl, '_blank');
  //   }
  // }
}

