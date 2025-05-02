import { Injectable } from "@angular/core";
import { ECCalculationsBase } from "./ec-calculations-base";
import { EnumGstType, appCommon } from "src/app/common/_appCommon";
import { IECBoxViewModel } from "src/app/core/interfaces/invoice-extra-charge";
import { IInvoiceGridResult } from "src/app/core/interfaces/invoice-grid-result";
import { CompanyResolver } from "src/app/core/helpers/company-resolver";
import { ICompanyViewModel } from "src/app/core/interfaces/company";

@Injectable({
    providedIn: 'root'
})

export class ECCalculationsGST extends ECCalculationsBase {

    currentCompany: ICompanyViewModel;
    appCommon = appCommon;

    constructor(private companyResolver: CompanyResolver) {
        super();
        this.currentCompany = companyResolver.getCurrentCompany();
    }

    public CalculateEC(gstType: EnumGstType, extracharges: IECBoxViewModel[], itemSubTotal: number, maxTax: number, vatDictionary: any): number {

        for (let index = 0; index < extracharges.length; index++) {
            //calculate charge based on item subtotal
            var ele = extracharges[index];

            if (ele.percentBased) {

                let amountSubTotal = itemSubTotal;

                for (let i = 0; i < index; i++) {

                    let eleInner = extracharges[i];
                    amountSubTotal += eleInner.effectOnTotal ? eleInner.charge * (eleInner.effectOnTotal ? 1 : -1) : 0;
                }

                ele.charge = appCommon.Round(amountSubTotal * (ele.perVal / 100), this.currentCompany.precision);
            }
        }

        for (let index = 0; index < extracharges.length; index++) {

            let ele = extracharges[index];

            if (ele.hasTaxEffect && ele.effectOnTotal && ele.taxType == 0) {

                //Gst effect calculation-------------------------------------------------------------------------------------//
                if (gstType == EnumGstType.IntraState) {

                    var charge = ele.charge * (ele.effectOnTotal ? 1 : -1);
                    var taxAmount = charge * ((maxTax / 2) / 100);

                    var cgst = extracharges.find(e => e.name.toLowerCase() == "cgst");
                    if (cgst != null) {
                        cgst.charge += appCommon.Round(taxAmount, this.currentCompany.precision);
                        cgst.assessmentAmount += charge;
                    }

                    var sgst = extracharges.find(e => e.name.toLowerCase() == "sgst");
                    if (sgst != null) {
                        sgst.charge += appCommon.Round(taxAmount, this.currentCompany.precision);
                        sgst.assessmentAmount += charge;
                    }
                }
                else {
                    var charge = ele.charge * (ele.effectOnTotal ? 1 : -1);
                    var taxAmount = charge * ((maxTax) / 100);

                    var igst = extracharges.find(e => e.name.toLowerCase() == "igst");
                    if (igst != null) {
                        igst.charge += appCommon.Round(taxAmount, this.currentCompany.precision);
                        igst.assessmentAmount += charge;
                    }
                }
                //-----------------------------------------------------------------------------------------------------------//
            }
        }

        let sum: number = 0;
        let ecs = extracharges.filter(ec => ec.effectOnTotal);

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

        if (gstType == EnumGstType.IntraState) {

            var gstPer = appCommon.Round(taxPer / 2, this.currentCompany.precision);
            var gstAmount = appCommon.Round(amount * (gstPer / 100), this.currentCompany.precision);

            result.cgstPer = gstPer;
            result.cgstAmt = gstAmount;

            result.sgstPer = gstPer;
            result.sgstAmt = gstAmount;
        }
        else {
            var gstAmount = appCommon.Round(amount * (taxPer / 100), this.currentCompany.precision);

            result.igstPer = taxPer;
            result.igstAmt = gstAmount;
        }

        return result;
    }
}