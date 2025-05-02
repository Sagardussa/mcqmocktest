import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuizComponent } from '../quiz/quiz.component';
// import { LedgerSelectionComponent } from './ledger-selection/ledger-selection.component';
// import { ItemSelectionComponent } from './item-selection/item-selection.component';
// import { GroupSelectionComponent } from './group-selection/group-selection.component';
// import { AgEditButtonRendererComponent } from './custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
// import { AgDeleteButtonRendererComponent } from './custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
// import { AgViewButtonRendererComponent } from './custom-ag-controls/ag-view-button-renderer/ag-view-button-renderer.component';
// import { SearchLedgerComponent } from './search-ledger/search-ledger.component';
// import { InvoiceDetailsModalComponent } from './invoice-details-modal/invoice-details-modal.component';
// import { LocalPrecisionNumberPipe } from '../providers/custom-pipe/local-precision-number.pipe';
// import { AgContextMenuButtonRendererComponent } from './custom-ag-controls/ag-context-menu-button-renderer/ag-context-menu-button-renderer.component';
// import { ResultListContextComponent } from './result-list-context/result-list-context.component';
// import { PendingVoucherSelectionComponent } from './pending-voucher-selection/pending-voucher-selection.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AgGridModule } from 'ag-grid-angular';
// import { NgbDropdownModule, NgbModalModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
// import { ClipboardModule } from 'ngx-clipboard';
// import { AgPrintButtonRendererComponent } from './custom-ag-controls/ag-print-button-renderer/ag-print-button-renderer.component';
// import { VoucherDetailsModalComponent } from './voucher-details-modal/voucher-details-modal.component';
// import { InvoiceEmailModalComponent } from './invoice-email-modal/invoice-email-modal.component';
// import { ImagePreviewModelComponent } from './image-preview-model/image-preview-model.component';
// import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { SumBasedOnCrDr } from '../providers/custom-pipe/sum-based-on-cr-dr.pipe';
// import { SumOfArrayPropertyPipe } from '../providers/custom-pipe/sum-of-array-property.pipe';
// import { LedgerDetailsModalComponent } from './ledger-details-modal/ledger-details-modal.component';
// import { InvoiceWhatsappModalComponent } from './invoice-whatsapp-modal/invoice-whatsapp-modal.component';
// import { PrintViewModalComponent } from './print-view-modal/print-view-modal.component';
// import { AppAccordionComponent } from './app-accordion/app-accordion.component';
// import { LoaderComponent } from './loader/loader.component';
// import { LocationSelectionListComponent } from './location-selection-list/location-selection-list.component';
// import { TableModule } from 'primeng/table';
// import { CheckboxCellComponent } from './custom-ag-controls/checkbox-cell/checkbox-cell.component';
// import { FormatNumberValPipe } from '../providers/custom-pipe/format-number-val.pipe';
// import { BomItemDetailsViewComponent } from './bom-item-details-view/bom-item-details-view.component';
// import { DateRangeSelectorComponent } from './date-range-selector/date-range-selector.component';
// import { AgCommonRendererComponent } from './custom-ag-controls/ag-common-renderer/ag-common-renderer.component';
// import { TextAreaEditorComponent } from './custom-ag-controls/text-area-editor/text-area-editor.component';
// import { CustomDateComponent } from './custom-ag-controls/custom-date/custom-date.component';
// import { CustomNumberComponent } from './custom-ag-controls/custom-number/custom-number.component';
// import { AgActionButtonRendererComponent } from './custom-ag-controls/ag-action-button-renderer/ag-action-button-renderer.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { CommonAutocompleteTemplateComponent } from './common-autocomplete-template/common-autocomplete-template.component';
// import { DynamicTranslatePipe } from '../providers/custom-pipe/dynamic-translate.pipe';
// import { CustomDropdownComponent } from './custom-ag-controls/custom-dropdown/custom-dropdown.component';
// import { ItemRegisterViewComponent } from './item-register-view/item-register-view.component';
// import { CommonModalComponent } from './common-modal/common-modal.component';
// import { IsGrantedDirective } from './permission/is-granted.directive';
// import { AgMultiCalculationRendererComponent } from './custom-ag-controls/ag-multi-calculation-renderer/ag-multi-calculation-renderer.component';
// import { AgImageCellRendererComponent } from './custom-ag-controls/ag-image-cell-renderer/ag-image-cell-renderer.component';
// import { FocusNextDirective } from './focus-next-directive/focus-next.directive';
// import { ItemListModalComponent } from './item/item-list-modal/item-list-modal.component';
// import { ItemAddModalComponent } from './item/item-add-modal/item-add-modal.component';
// import { PosSettingsPopupComponent } from './pos-settings-popup/pos-settings-popup.component';

@NgModule({
  declarations: [
    // LedgerSelectionComponent,
    // ItemSelectionComponent,
    // GroupSelectionComponent,
    // AgEditButtonRendererComponent,
    // AgDeleteButtonRendererComponent,
    // LocalPrecisionNumberPipe,
    // SumBasedOnCrDr,
    // PosSettingsPopupComponent,
    // AgViewButtonRendererComponent,
    // PendingVoucherSelectionComponent,
    // ResultListContextComponent,
    // AgContextMenuButtonRendererComponent,
    // InvoiceDetailsModalComponent,
    // SearchLedgerComponent,
    // AgPrintButtonRendererComponent,
    // VoucherDetailsModalComponent,
    // InvoiceEmailModalComponent,
    // ImagePreviewModelComponent,
    // ConfirmationModalComponent,
    // SumOfArrayPropertyPipe,
    // LedgerDetailsModalComponent,
    // InvoiceWhatsappModalComponent,
    // PrintViewModalComponent,
    // AppAccordionComponent,
    // LoaderComponent,
    // LocationSelectionListComponent,
    // CheckboxCellComponent,
    // FormatNumberValPipe,
    // BomItemDetailsViewComponent,
    // DateRangeSelectorComponent,
    // AgCommonRendererComponent,
    // TextAreaEditorComponent,
    // CustomDateComponent,
    // CustomNumberComponent,
    // AgActionButtonRendererComponent,
    // CommonAutocompleteTemplateComponent,
    // DynamicTranslatePipe,
    // CustomDropdownComponent,
    // ItemRegisterViewComponent,
    // CommonModalComponent,
    // IsGrantedDirective,
    // AgMultiCalculationRendererComponent,
    // AgImageCellRendererComponent,
    // FocusNextDirective,
    // IsGrantedDirective,
    // ItemListModalComponent,
    // ItemAddModalComponent,
    // PosSettingsPopupComponent,
  ],
  imports: [
    CommonModule,
    // NgbModule,
    // NgbModalModule,
    //UiModule,
    ReactiveFormsModule,
    // FileUploadModule,

  ],
  exports: [
    // LedgerSelectionComponent,
    // ItemSelectionComponent,
    // GroupSelectionComponent,
    // PendingVoucherSelectionComponent,
    // LocalPrecisionNumberPipe,
    // SumBasedOnCrDr,
    // PosSettingsPopupComponent,
    // InvoiceDetailsModalComponent,
    // SearchLedgerComponent,
    // ImagePreviewModelComponent,
    // ConfirmationModalComponent,
    // SumOfArrayPropertyPipe,
    // LedgerDetailsModalComponent,
    // InvoiceWhatsappModalComponent,
    // PrintViewModalComponent,
    // AppAccordionComponent,
    // LoaderComponent,
    // LocationSelectionListComponent,
    // CheckboxCellComponent,
    // FormatNumberValPipe,
    // BomItemDetailsViewComponent,
    // DateRangeSelectorComponent,
    // AgCommonRendererComponent,
    // TextAreaEditorComponent,
    // CommonAutocompleteTemplateComponent,
    // DynamicTranslatePipe,
    // ItemRegisterViewComponent,
    // CommonModalComponent,
    // IsGrantedDirective,
    // AgMultiCalculationRendererComponent,
    // AgImageCellRendererComponent,
    // FocusNextDirective,
    // IsGrantedDirective,
    // ItemListModalComponent,
    // ItemAddModalComponent,
  ]
})
export class SharedModule { }
