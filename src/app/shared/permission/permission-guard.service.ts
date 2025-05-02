import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { PermissionManagerService } from './permission-manager.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PermissionGuardService implements CanActivate {

  isAllowed: boolean = false

  constructor(private router: Router,
    private permissionManagerService: PermissionManagerService,
    private location: Location
  ) { }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.isAllowed = false;

    const url: any = state.url;
    const type = this.extractTypeFromUrl(url);
    const roles = this.getRolesForType(type);

    if (type && (url.includes("invoices") || url.includes('voucher'))) {
      roles.forEach((v: any) => {
        if (this.permissionManagerService.isGranted(v)) {
          this.isAllowed = true;
          return true;
        } else {
          return false;
        }
      });
    } else {
      route.data.roles.forEach((v: any) => {
        if (this.permissionManagerService.isGranted(v)) {
          this.isAllowed = true;
          return true;
        } else {
          return false;
        }
      });
    }

    if (this.isAllowed)
      return true;
    else {
      alert("You are not authorize to access this path.");
      this.router.navigate(['/']);
      //this.location.back();
      return false;
    }
  }

  private extractTypeFromUrl(url: string): string {
    const segments = url.split('/').filter(segment => segment); // Filter out empty segments
    if (segments.length >= 2) {
      const baseType = segments[1];
      const subType = segments[2] ? `/${segments[2]}` : '';
      return baseType + subType;
    }
    return '';
  }

  private getRolesForType(type: string): number[] {
    const roleMapping: { [key: string]: number[] } = {

      //Sales
      'sales-invoice': [59, 60, 61, 62, 63, 64], // Define roles for search
      'sales-invoice/new': [62], // Define roles for new
      'sales-invoice/edit': [61], // Define roles for edit
      'sales-enquiry': [188, 189, 190, 191, 192, 193],
      'sales-enquiry/new': [191],
      'sales-enquiry/edit': [190],
      'sales-quotation': [71, 72, 73, 74, 75, 76],
      'sales-quotation/new': [74],
      'sales-quotation/edit': [73],
      'sales-order': [77, 78, 79, 80, 81, 82],
      'sales-order/new': [80],
      'sales-order/edit': [79],
      'performa-invoice': [161, 162, 163, 164, 165, 166],
      'performa-invoice/new': [164],
      'performa-invoice/edit': [163],
      'sales-challan': [83, 84, 85, 86, 87, 88],
      'sales-challan/new': [86],
      'sales-challan/edit': [85],
      'sales-challan-return': [267, 268, 269, 270, 271, 272],
      'sales-challan-return/new': [270],
      'sales-challan-return/edit': [269],
      'sale-return': [65, 66, 67, 68, 69, 70],
      'sale-return/new': [68],
      'sale-return/edit': [67],
      'cancel-document': [285, 286, 287, 288, 289, 290],
      'cancel-document/new': [288],
      'cancel-document/edit': [287],

      //Purchase
      'purchase-quotation': [393, 394, 395, 396, 397, 398],
      'purchase-quotation/new': [396],
      'purchase-quotation/edit': [395],
      'purchase-order': [89, 90, 91, 92, 93, 94],
      'purchase-order/new': [92],
      'purchase-order/edit': [91],
      'purchase-challan': [200, 201, 202, 203, 204, 205],
      'purchase-challan/new': [203],
      'purchase-challan/edit': [202],
      'purchase-challan-return': [273, 274, 275, 276, 277, 278],
      'purchase-challan-return/new': [276],
      'purchase-challan-return/edit': [275],
      'purchase-invoice': [95, 96, 97, 98, 99, 100],
      'purchase-invoice/new': [98],
      'purchase-invoice/edit': [97],
      'purchase-return': [101, 102, 103, 104, 105, 106],
      'purchase-return/new': [104],
      'purchase-return/edit': [103],
      'costing': [228, 229, 230, 231, 232, 233],
      'costing/new': [231],
      'costing/edit': [230],

      //Stock
      'opening-stock': [107, 108, 109, 110, 111, 112],
      'opening-stock/new': [110],
      'opening-stock/edit': [109],
      'transfered-out-stock': [119, 120, 121, 122, 123, 124],
      'transfered-out-stock/new': [122],
      'transfered-out-stock/edit': [121],
      'transfered-in-stock': [113, 114, 115, 116, 117, 118],
      'transfered-in-stock/new': [116],
      'transfered-in-stock/edit': [115],
      'material-slip': [242, 243, 244, 245, 246, 247],
      'material-slip/new': [245],
      'material-slip/edit': [244],
      'material-in': [248, 249, 250, 251, 252, 253],
      'material-in/new': [251],
      'material-in/edit': [250],
      'material-out': [254, 255, 256, 257, 258, 259],
      'material-out/new': [257],
      'material-out/edit': [256],
      'stock-adjustment': [125, 126, 127, 128, 129, 130],
      'stock-adjustment/new': [128],
      'stock-adjustment/edit': [127],
      'barcode': [279, 280, 281, 282, 283, 284],
      'barcode/new': [282],
      'barcode/edit': [281],
      'marketing-expense-voucher': [411, 412, 413, 414, 415, 416],
      'marketing-expense-voucher/new': [414],
      'marketing-expense-voucher/edit': [413],
      'foc-voucher': [417, 418, 419, 420, 421, 422],
      'foc-voucher/new': [420],
      'foc-voucher/edit': [419],
      'replacement-out-voucher': [423, 424, 425, 426, 427, 428],
      'replacement-out-voucher/new': [426],
      'replacement-out-voucher/edit': [425],
      'cap-stock-voucher': [429, 430, 431, 432, 433, 434],
      'cap-stock-voucher/new': [432],
      'cap-stock-voucher/edit': [431],
      'scrap-stock-voucher': [435, 436, 437, 438, 439, 440],
      'scrap-stock-voucher/new': [438],
      'scrap-stock-voucher/edit': [437],

      //production House
      'internal-order-generate': [291, 292, 293, 294, 295, 296],
      'internal-order-generate/new': [294],
      'internal-order-generate/edit': [293],
      'qc-production': [303, 304, 305, 306, 307, 308],
      'qc-production/new': [306],
      'qc-production/edit': [305],
      'job-work-customer-challan-in': [309, 310, 311, 312, 313, 314],
      'job-work-customer-challan-in/new': [312],
      'job-work-customer-challan-in/edit': [311],
      'job-work-customer-challan-out': [315, 316, 317, 318, 319, 320],
      'job-work-customer-challan-out/new': [318],
      'job-work-customer-challan-out/edit': [317],
      'job-work-supplier-challan-out': [327, 328, 329, 330, 331, 332],
      'job-work-supplier-challan-out/new': [330],
      'job-work-supplier-challan-out/edit': [329],
      'job-work-supplier-challan-in': [321, 322, 323, 324, 325, 326],
      'job-work-supplier-challan-in/new': [324],
      'job-work-supplier-challan-in/edit': [323],
      'dismantle-entry': [399, 400, 401, 402, 403, 404],
      'dismantle-entry/new': [402],
      'dismantle-entry/edit': [401],
      'job-work-order': [405, 406, 407, 408, 409, 410],
      'job-work-order/new': [408],
      'job-work-order/edit': [407],
      'return-material-in': [458, 459, 460, 461, 462, 463],
      'return-material-in/new': [461],
      'return-material-in/edit': [460],
      'return-material-out': [464, 465, 466, 467, 468, 469],
      'return-material-out/new': [467],
      'return-material-out/edit': [466],


      //Store
      'qc-grn': [297, 298, 299, 300, 301, 302],
      'qc-grn/new': [300],
      'qc-grn/edit': [299],
      'mfg-order-slip': [339, 340, 341, 342, 343, 344],
      'mfg-order-slip/new': [342],
      'mfg-order-slip/edit': [341],
      'ready-production-slip': [333, 334, 335, 336, 337, 338],
      'ready-production-slip/new': [336],
      'ready-production-slip/edit': [335],
      'packing-slip': [345, 346, 347, 348, 349, 350],
      'packing-slip/new': [348],
      'packing-slip/edit': [347],
      'consume-raw-material': [351, 352, 353, 354, 355, 356],
      'consume-raw-material/new': [354],
      'consume-raw-material/edit': [353],

      //Accounts
      // sale invoice --> sales-voucher
      // sale return --> Credit Note Voucher
      // purchase-invoice --> purchase voucher
      // purchase return --> Debit Note Voucher
      'sales-voucher': [59, 60, 61, 62, 63, 64],
      'sales-voucher/new': [62],
      'sales-voucher/edit': [61],
      'credit-note': [65, 66, 67, 68, 69, 70],
      'credit-note/new': [68],
      'credit-note/edit': [67],
      'purchase-voucher': [95, 96, 97, 98, 99, 100],
      'purchase-voucher/new': [98],
      'purchase-voucher/edit': [97],
      'debit-note': [101, 102, 103, 104, 105, 106],
      'debit-note/new': [104],
      'debit-note/edit': [103],
      'payment-voucher': [131, 132, 133, 134, 135, 136],
      'payment-voucher/new': [134],
      'payment-voucher/edit': [133],
      'receipt-voucher': [137, 138, 139, 140, 141, 142],
      'receipt-voucher/new': [140],
      'receipt-voucher/edit': [139],
      'journal-voucher': [143, 144, 145, 146, 147, 148],
      'journal-voucher/new': [146],
      'journal-voucher/edit': [145],
      'contra-voucher': [149, 150, 151, 152, 153, 154],
      'contra-voucher/new': [152],
      'contra-voucher/edit': [151],
    };
    return roleMapping[type] || [];
  }
}
