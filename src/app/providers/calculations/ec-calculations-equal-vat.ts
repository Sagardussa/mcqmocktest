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

export class ECCalculationsEqualVAT extends ECCalculationsBase {

    currentCompany: ICompanyViewModel;
    appCommon = appCommon;

    constructor(private companyResolver: CompanyResolver) {
        super();
        this.currentCompany = companyResolver.getCurrentCompany();
    }

    public CalculateEC(gstType: EnumGstType, extracharges: IECBoxViewModel[], itemSubTotal: number, maxTax: number, vatDictionary: any[]): number {

        //get all tax types
        var taxtypes = extracharges.filter(a => a.taxType != 0);

        taxtypes.forEach(ec => {
            ec.charge = 0;
            ec.assessmentAmount = 0;
        });

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

        //get all vat types
        var vattypes = [];
        for (const [index, value] of extracharges.entries()) {
            if (value.taxType == EnumTaxType.VAT) {
                vattypes.push({ ec: value, index: index });
            }
        }

        for (const vat of vattypes) {

            var vatDicObj = vatDictionary.find(x => x.perVal == vat.ec.perVal);
            if (vatDicObj) {

                extracharges[vat.index].charge = vatDicObj.amount;
                extracharges[vat.index].assessmentAmount = vatDicObj.assessmentAmount;

                for (var index = 0; index < extracharges.length; index++) {

                    let ele = extracharges[index];
                    let vatAmount = 0;
                    let vatAssessment = 0;

                    if (ele.hasTaxEffect && ele.effectOnTotal && ele.taxType == 0) {
                        if (ele.percentBased) {
                            if (ele.perVal > 0) {
                                vatAmount = extracharges[vat.index].charge * (ele.effectOnTotal ? 1 : -1) * (ele.perVal / 100);

                                vatAssessment = extracharges[vat.index].assessmentAmount * (ele.effectOnTotal ? 1 : -1) * (ele.perVal / 100);
                            }
                        }
                        else {
                            if (ele.effectOnTotal) {

                                var extrachargesTotal = 0;
                                var extrachargesList = extracharges.filter(x => x.hasTaxEffect && x.effectOnTotal && !x.effectOnTotal);

                                if (extrachargesList.length > 0) {
                                    extrachargesList.forEach(ec => extrachargesTotal + ec.charge);
                                }

                                var newItemSubTotal = itemSubTotal - extrachargesTotal

                                vatAmount = (extracharges[vat.index].assessmentAmount / newItemSubTotal)
                                    * ele.charge
                                    * (ele.effectOnTotal ? 1 : -1)
                                    * (extracharges[vat.index].perVal / 100);

                                vatAssessment = (extracharges[vat.index].assessmentAmount / newItemSubTotal)
                                    * ele.charge
                                    * (ele.effectOnTotal ? 1 : -1);
                            }
                            else {
                                vatAmount = (extracharges[vat.index].assessmentAmount / itemSubTotal)
                                    * ele.charge
                                    * (ele.effectOnTotal ? 1 : -1)
                                    * (extracharges[vat.index].perVal / 100);

                                vatAssessment = (extracharges[vat.index].assessmentAmount / itemSubTotal)
                                    * ele.charge
                                    * (ele.effectOnTotal ? 1 : -1);
                            }
                        }
                    }
                    extracharges[vat.index].charge += appCommon.Round(vatAmount, this.currentCompany.precision);
                    extracharges[vat.index].assessmentAmount += appCommon.Round(vatAssessment, this.currentCompany.precision);
                }
            }
            else {
                extracharges[vat.index].charge = 0;
                extracharges[vat.index].assessmentAmount = 0;
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

        if (!extracharges) { return itemSubTotal; }

        let sum: number = 0;
        let ecs = extracharges.filter(ec => ec.taxType != 0);

        if (ecs.length > 0) {
            ecs.forEach(ec => sum + ec.assessmentAmount);
        }

        return sum;
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

        var taxAmount = appCommon.Round(amount * (taxPer / 100), this.currentCompany.precision);

        result.vatPer = taxPer;
        //result.vatAmt = taxAmount;
        result.rateAfterVat = taxAmount;

        return result;
    }
}