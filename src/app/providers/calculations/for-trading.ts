import { Injectable } from "@angular/core";
import { appCommon } from "src/app/common/_appCommon";
import { AuthServiceService } from "../services/auth-service.service";
import { CompanyResolver } from "src/app/core/helpers/company-resolver";
import { ICompanyViewModel } from "src/app/core/interfaces/company";
import { ECCalculationResolver } from "src/app/core/helpers/ec-calculation-resolver";
import { IItem } from "src/app/core/interfaces/item";

@Injectable({
    providedIn: 'root'
})

export class ForTrading {

    colRateAfterVat: boolean = false;
    colRebate: boolean = false;
    colLanding: boolean = false;
    colMRP: boolean = false;
    colExpectedMargin: boolean = false;
    colSugComission: boolean = false;
    colSizeQty: boolean = false;
    colProfit: boolean = false;
    colColorantCost: boolean = false;
    colLandingCosDisc: boolean = false;
    colCGSTPer: boolean = false;
    colCGSTAmt: boolean = false;
    colSGSTPer: boolean = false;
    colSGSTAmt: boolean = false;
    colIGSTPer: boolean = false;
    colIGSTAmt: boolean = false;
    colVat: boolean = false;
    colCostRate: boolean = false;

    currentCompany: ICompanyViewModel;
    public appCommon = appCommon;

    constructor(private companyResolver: CompanyResolver, private ecCalculationResolver: ECCalculationResolver) {

        this.currentCompany = companyResolver.getCurrentCompany();

        this.colLanding = true;
        this.colCostRate = true;
        this.colProfit = true;
    }

    public InvoiceGridCalculations(gstType: any, qty: number, rate: number, disc1: number, disc2: number
        , disc3: number, ratedisc: number, vat: number, conversion: number, rebate: number, sizeQty: number, mrp: number, landingCostDic: number, basecurrency: number, item: IItem, unitid: number, transactionType: any, invType: any, currRate: number, itemAmount: number = 0, ledger_Id_Object: any) {

        let result = {
            amount: 0,
            landing: 0,
            cgstPer: 0,
            cgstAmt: 0,
            sgstPer: 0,
            sgstAmt: 0,
            igstPer: 0,
            igstAmt: 0,
            vatPer: 0,
            vatAmt: 0,
            rateAfterVat: 0,
            expectedMargin: 0,
            cost_Rate: 0,
            profit: 0,
            conversion: conversion
        };

        let landing = this.ProcessDiscountOnRate(rate, disc1, disc2, disc3, ratedisc, basecurrency);
        let grossAmount = qty * landing;

        //calulate amount
        result.amount = itemAmount ? appCommon.Round(itemAmount, this.currentCompany.precision) : appCommon.Round(grossAmount, this.currentCompany.precision);

        //3 - SEZ
        //4 - EXPORT
        //11 - Import 
        //if (transactionType != 3 && transactionType != 4 && transactionType != 11) {
        if (!((transactionType == 3 || transactionType == 4 || transactionType == 11 || transactionType == 12) || (invType == 5 && transactionType == 5))) {
            if ((ledger_Id_Object?.gstCategory && appCommon.GstCategoryObj[ledger_Id_Object.gstCategory] === 'Un Registered') && !(invType == 1 && transactionType == 10)) {
                // If gstCategory is SEZ (id = 7), skip tax calculation
                console.log("SEZ category, skipping tax calculation");
            } else {
                //calculate tax amount
                var taxval = this.ecCalculationResolver.ecCalculation.GetTaxValue(gstType, vat, result.amount);
                result.cgstPer = taxval.cgstPer;
                result.cgstAmt = taxval.cgstAmt;
                result.sgstPer = taxval.sgstPer;
                result.sgstAmt = taxval.sgstAmt;
                result.igstPer = taxval.igstPer;
                result.igstAmt = taxval.igstAmt;
                //result.vatAmt = taxval.vatAmt;
                result.rateAfterVat = taxval.rateAfterVat;
                result.vatPer = taxval.vatPer;
            }
        }
        //calculate landing cost
        result.landing = landing;

        if (item.multiRate) {
            if (item.unit_Conv.length) {
                //when item is multirate refer last purchase rate from unit conversion
                var unitC = item.unit_Conv.filter(x => x.unit_Conv_ID == unitid)[0];
                if (unitC) {
                    result.cost_Rate = unitC.lastPurchaseRate;
                }
            }
        }
        else {
            //else consider cost rate from item master
            var costRate = this.GetCostRate(item);
            result.cost_Rate = costRate ? costRate : 0;
        }
        result.profit = this.InvoiceGridCalculateProfit(qty, rate, result.landing, result.amount, result.cost_Rate, currRate);

        return result;
    }

    public InvoiceGridCalculateProfit(qty: number, rate: number, landing: number, amount: number, costRate: number, currRate: number) {
        const effectiveAmount = currRate ? amount * currRate : amount; // If convertedItemRate exists, multiply it with costRate
        return costRate == 0 ? 0 : effectiveAmount - (costRate * qty);
    }

    public SelectItem(sno: number, particular: string, gstType: any, stockplace: number, unitid: number, unitConv: any, qty: number, rate: number, disc1: number, disc2: number, rateDiscount: number, vatper: number, rebate: number, sizqty: number, mrp: number, description: string, item: IItem, invType: any, comission: number, landing: number, colorantCost: number,
        mfrCodeReq: boolean, stockEffect: number, mfrFromTextBox: string, mfsFromSelection: string, landingcostdisc: number, basecurrency: number, transactionType: any, currRate: number, ledger_Id_Object: any) {

        var invoiceItemDetail: any = {};

        invoiceItemDetail.sno = sno;
        invoiceItemDetail.particular = particular;
        invoiceItemDetail.sp_Code = stockplace;

        if (mfrCodeReq && stockEffect == 1) {
            invoiceItemDetail.mfrItemName = mfrFromTextBox;
        }
        else if (mfrCodeReq && stockEffect == -1) {
            invoiceItemDetail.mfrItemName = mfsFromSelection;
        }

        invoiceItemDetail.invType = invType;
        invoiceItemDetail.conv_Unit = unitid;
        invoiceItemDetail.conv_Rate = rate;
        invoiceItemDetail.discount1 = disc1;
        invoiceItemDetail.discount2 = disc2;
        invoiceItemDetail.rateDiscount = rateDiscount;
        invoiceItemDetail.vatPer = this.currentCompany.isTaxable ? vatper : 0;

        var unitC;
        //when item is multirate refer last purchase rate from unit conversion
        if (item.multiRate) {
            if (item.unit_Conv.length) {
                unitC = item.unit_Conv.filter(x => x.unit_Conv_ID == unitid)[0];
            }
        }

        var result = this.InvoiceGridCalculations(
            gstType,
            qty,
            rate,
            disc1,
            disc2,
            0,
            rateDiscount,
            vatper,
            unitC ? unitC.convQty : 1,
            rebate,
            sizqty,
            mrp,
            landingcostdisc,
            basecurrency,
            item,
            unitid,
            transactionType,
            invType,
            currRate,
            0,
            ledger_Id_Object);

        invoiceItemDetail.amount = result.amount;
        invoiceItemDetail.itemDescription = description;
        invoiceItemDetail.item_ID = item.id;
        invoiceItemDetail.std_Qty = qty;
        invoiceItemDetail.conversion = result.conversion;
        invoiceItemDetail.conv_Qty = appCommon.Round(qty * result.conversion, this.currentCompany.precision);
        invoiceItemDetail.std_Rate = rate;
        invoiceItemDetail.rateAfterVat = result.rateAfterVat;
        invoiceItemDetail.rebate = rebate;
        invoiceItemDetail.mrp = mrp;
        invoiceItemDetail.expectedMargin = result.expectedMargin;
        invoiceItemDetail.sugComission = comission;
        invoiceItemDetail.sizeQty = sizqty;

        invoiceItemDetail.cgstPer = result.cgstPer;
        invoiceItemDetail.cgstAmt = result.cgstAmt;
        invoiceItemDetail.sgstPer = result.sgstPer;
        invoiceItemDetail.sgstAmt = result.sgstAmt;
        invoiceItemDetail.igstPer = result.igstPer;
        invoiceItemDetail.igstAmt = result.igstAmt;
        //invoiceItemDetail.vatAmt = result.vatAmt;
        invoiceItemDetail.rateAfterVat = result.rateAfterVat;
        invoiceItemDetail.landing = result.landing;
        invoiceItemDetail.cost_Rate = result.cost_Rate;
        invoiceItemDetail.profit = result.profit

        return invoiceItemDetail;
    }

    public OnCompanyChange() {
        this.colVat = this.currentCompany.isTaxable;

        this.colCGSTPer =
            this.colCGSTAmt =
            this.colSGSTPer =
            this.colSGSTAmt =
            this.colIGSTPer =
            this.colIGSTAmt = this.currentCompany.isTaxable && !(this.currentCompany.taxType == 0 || this.currentCompany.taxType == 5);
    }

    public GetCostRate(item: any) {
        switch (item.costing_On) {
            case this.appCommon.EnCostingOnObj.Standard:
            case this.appCommon.EnCostingOnObj.last_PurchaseRate:
                return item.last_Purchaserate;

            case this.appCommon.EnCostingOnObj.avg_PurchaseRate:
                return item.avg_Purchaserate;

            case this.appCommon.EnCostingOnObj.FIFO:
            case this.appCommon.EnCostingOnObj.LIFO:
            case this.appCommon.EnCostingOnObj.ZeroCost:
            case this.appCommon.EnCostingOnObj.FIFOPerpetual:
            case this.appCommon.EnCostingOnObj.LIFOPerpetual:
            case this.appCommon.EnCostingOnObj.MonthlyAverageCost:
            case this.appCommon.EnCostingOnObj.OptimalCost:
            default:
                return 0;
        }
    }

    public AdjustItemRate(amount: number, extracharges: number, itemsubtotal: number) {
        return this.appCommon.Round((amount * extracharges) / itemsubtotal, this.currentCompany.precision);
    }

    public ProcessDiscountOnRate(rate: number, disc1: number, disc2: number, disc3: number, ratedisc: number, basecurrency: number) {

        let d1 = rate * (1 - (disc1 / 100));
        let d2 = d1 * (1 - (disc2 / 100));
        let d3 = d2 - disc3;
        let d4 = d3 - ratedisc;

        //convert rate if other then base currency
        d4 = d4 * (basecurrency ? basecurrency : 1);

        return d4;
    }

    public GetInventoryMoved(itemSubDetail: any) {

        var inventoryMoved = 0;

        if (itemSubDetail && itemSubDetail.length > 0) {
            //case when only new reference exists    
            if (itemSubDetail.length == 1) {
                var ele = itemSubDetail[0];
                inventoryMoved = inventoryMoved + (ele.effect * ele.qty)

            } else {
                //case when against reference exists
                var newRefList = itemSubDetail.filter(x => !x.new0_Against1);
                if (newRefList != null && newRefList.length > 0) {

                    var newRef = newRefList[0];
                    inventoryMoved = inventoryMoved + (newRef.effect * newRef.qty)

                    var againstRefList = itemSubDetail.filter(x => x.new0_Against1);

                    for (var i = 0; i < againstRefList.length; i++) {
                        var ele = againstRefList[i];
                        if (newRef.effect == ele.effect) {
                            inventoryMoved = inventoryMoved - (ele.effect * ele.qty)
                        }
                    }
                }
            }
        }

        return inventoryMoved;
    }
}