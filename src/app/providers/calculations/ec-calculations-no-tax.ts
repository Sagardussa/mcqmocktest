import { Injectable } from "@angular/core";
import { ECCalculationsBase } from "./ec-calculations-base";
import { EnumGstType, EnumTaxType, appCommon } from "src/app/common/_appCommon";
import { IECBoxViewModel } from "src/app/core/interfaces/invoice-extra-charge";
import { IInvoiceGridResult } from "src/app/core/interfaces/invoice-grid-result";
import { ICompanyViewModel } from "src/app/core/interfaces/company";
import { CompanyResolver } from "src/app/core/helpers/company-resolver";

@Injectable({
    providedIn: 'root'
})

export class ECCalculationsNoTax extends ECCalculationsBase {

    currentCompany: ICompanyViewModel;
    appCommon = appCommon;

    constructor(private companyResolver: CompanyResolver) {
        super();
        this.currentCompany = companyResolver.getCurrentCompany();
    }

    public CalculateEC(gstType: EnumGstType, extracharges: IECBoxViewModel[], itemSubTotal: number, maxTax: number, vatDictionary: any[]): number {

        for (var index = 0; index < extracharges.length; index++) {
            var ele = extracharges[index];

            //calculate charge based on item subtotal
            if (ele.percentBased) {
                var amountSubTotal = itemSubTotal;

                for (var i = 0; i < index; i++) {

                    var ele1 = extracharges[i];

                    amountSubTotal += ele1.effectOnTotal ? ele1.charge * (ele1.effectOnTotal ? 1 : -1) : 0;
                }

                ele.charge = appCommon.Round(amountSubTotal * (ele.perVal / 100), this.currentCompany.precision);
            }
        }

        let sum: number = 0;
        let ecs = extracharges.filter(ec => ec.effectOnTotal && !ec.hasTaxEffect);

        if (ecs.length > 0) {
            ecs.forEach(ec => sum + (ec.charge * (ec.effectOnTotal ? 1 : -1)));
        }

        return sum;
    }

    public GetSubTotal(itemSubTotal: number, extracharges: IECBoxViewModel[]): number {
        return itemSubTotal;
    }

    public GetTaxValue(gstType: EnumGstType, taxPer: number, amount: number): IInvoiceGridResult {

        const result: IInvoiceGridResult = {
            amount: 0,
            stdQty: 0,
            stdRate: 0,
            convQty: 0,
            convRate: 0,
            baseUnit: 0,
            convUnit: 0,
            conversions: 0,
            rateAfterVat: 0,
            rebate: 0,
            landing: 0,
            expectedMargin: 0,
            cgstPer: 0,
            cgstAmt: 0,
            sgstPer: 0,
            sgstAmt: 0,
            igstPer: 0,
            igstAmt: 0,
            vatPer: 0,
            vatAmt: 0
        };

        return result;
    }
}