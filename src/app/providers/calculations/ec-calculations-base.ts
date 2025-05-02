import { IInvoiceGridResult } from "src/app/core/interfaces/invoice-grid-result";
import { EnumGstType } from 'src/app/common/_appCommon';
import { IECBoxViewModel } from "src/app/core/interfaces/invoice-extra-charge";

export abstract class ECCalculationsBase {

    public abstract CalculateEC(gstType: EnumGstType, extracharges: IECBoxViewModel[], itemSubTotal: number, maxTax: number, vatDictionary: any): number

    public abstract GetSubTotal(itemSubTotal: number, extracharges: IECBoxViewModel[]): number

    public abstract GetTaxValue(gstType: EnumGstType, taxPer: number, amount: number): IInvoiceGridResult
}