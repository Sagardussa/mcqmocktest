import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Table } from 'primeng/table';
import { appCommon } from 'src/app/common/_appCommon';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { ItemServiceService } from 'src/app/providers/services/item-service.service';
import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { environment } from 'src/environments/environment';

interface ItemFilters {
  category?: any[];
  sizes?: string;
  type?: string;
  brand?: any[];
  itemGroup?: any[];
  usedFor?: number;
  showCategory?: boolean;
  showBrand?: boolean;
  showItemGroup?: boolean;
  isQtyAddOnPopup?: boolean;
}

@Component({
  selector: 'app-item-list-modal',
  templateUrl: './item-list-modal.component.html',
  styleUrls: ['./item-list-modal.component.scss']
})
export class ItemListModalComponent implements OnInit {
  @Input() isPOSItemWindow: boolean = false;
  @Input() fromPOS: boolean = false;
  @Output() passdata: EventEmitter<any> = new EventEmitter();
  recordList: any = [];
  filterRecordList: any = [];
  selectedSize = { name: 'Small', class: 'p-datatable-sm' }
  isDataLoading: boolean;
  public appCommon = appCommon;
  usedFor: number = 1;
  @Input() data;
  isFromBom: boolean;
  isPropixSalesOrder: boolean;
  selectedOptions: any[];
  invType: any;
  ItemUsedForType: any = [];
  currentCompany: ICompanyViewModel;
  categories: any[] = [];
  sizes: any[] = [];
  types: any[] = [];
  brands: any[] = [];
  itemGroups: any[] = [];
  filters: ItemFilters = { showCategory: true, category: [], brand: [], itemGroup: [], isQtyAddOnPopup: false };
  @ViewChild('dt1') dt1: Table;  // #dt1 reference from the HTML
  public config: PerfectScrollbarConfigInterface = {};
  @Output() onItemPOSClick: EventEmitter<any> = new EventEmitter();
  printSettings: any;
  constructor(
    private modalService: NgbModal,
    private itemServiceService: ItemServiceService,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageServiceService,
    companyResolver: CompanyResolver,) {
    this.currentCompany = companyResolver.getCurrentCompany();
    this.printSettings = localStorageService.getItem(appCommon.LocalStorageKeyType.PrintSettings);
  }

  ngOnInit(): void {
    var storedFormData = this.localStorageService.getSessionItem(appCommon.LocalStorageKeyType.ItemFormData);
    if (Object.keys(storedFormData).length !== 0) {
      this.usedFor = storedFormData;
      this.filters = storedFormData;
      this.usedFor = this.filters.usedFor;
    } else if (this.isPropixSalesOrder) { this.usedFor = 2; };
    this.search();
    this.isFromBom = this.data?.isFromBom;
    this.isPropixSalesOrder = this.data?.isPropixSalesOrder;
    this.invType = this.data?.invType;
    if (this.invType === 11) { this.ItemUsedForType = this.appCommon.ItemUsedForType.filter(item => item.id !== 2 && item.id !== 4); }
    else { this.ItemUsedForType = this.appCommon.ItemUsedForType }
    this.selectedOptions = this.isFromBom ? this.appCommon.ItemUsedForBOMType : (this.isPropixSalesOrder ? this.appCommon.ItemUsedForPropixType : this.ItemUsedForType);
  }

  async closeDialog(data: any): Promise<void> {
    this.passdata.emit({ data: data });
    this.modalService.dismissAll();
  }

  onSelectClick(item) {
    this.closeDialog(item);
  }

  cancelDialog() {
    this.closeDialog(null);
  }

  onRowSelect(item) {
    this.onSelectClick(item.data);
  }

  search() {
    var fdata = { usedFor: this.usedFor ? this.usedFor : null };
    this.isDataLoading = true;
    this.itemServiceService
      .Search(fdata)
      .subscribe(
        async data => {
          if (data.list.length) {
            this.isDataLoading = false;
            data.list.forEach(element => { if (element.filename) element.filename = environment.apiUrl + '/' + element.filename });

            this.recordList = data.list.filter(item => item.usedFor !== 25);
            this.filterRecordList = data.list.filter(item => item.usedFor !== 25);

            const uniqueValues = new Set(this.recordList.map(item => item['category']));

            this.categories = Array.from(uniqueValues)
              .filter(value => value)
              .sort((a: any, b: any) => a.localeCompare(b))
              .map(value => ({ category: value, isSelected: this.filters?.category?.some(c => c.category === value) }));

            if (this.usedFor || Object.keys(this.filters).length !== 0) await this.filterItems();

            this.getDistinctValues();
          }
        },
        error => {
          this.isDataLoading = false;
          this.toastrMessageService.showInfo(error.message ? error.message : error, "Info");

        });
  }

  getDistinctValues() {
    const fields = ['sizes', 'type', 'brand', 'itemGroup'];

    fields.forEach(field => {
      const uniqueValues = new Set(this.filterRecordList.map(item => item[field]));

      switch (field) {
        case 'sizes':
          this.sizes = Array.from(uniqueValues)
            .filter(value => value)
            .map(value => ({ sizes: value }));
          break;
        case 'type':
          this.types = Array.from(uniqueValues)
            .filter(value => value)
            .map(value => ({ type: value }));
          break;
        case 'brand':
          this.brands = Array.from(uniqueValues)
            .filter(value => value)
            .sort((a: any, b: any) => a.localeCompare(b))
            .map(value => ({ brand: value, isSelected: this.filters?.brand?.some(b => b.brand === value) }));
          break;
        case 'itemGroup':
          this.itemGroups = Array.from(uniqueValues)
            .filter(value => value)
            .sort((a: any, b: any) => a.localeCompare(b))
            .map(value => ({ itemGroup: value, isSelected: this.filters?.itemGroup?.some(b => b.itemGroup === value) }));
          break;
      }
    });
  };

  onUsedForChange() {
    this.filters.usedFor = this.usedFor;
    if (this.currentCompany.businessType == 23 && this.usedFor) {
      this.search();
    } else {
      this.search();
    }
  }

  getDataWithFilters() {
    this.filterItems();
    this.getDistinctValues();
  }

  onCategoryChange(event: any) {
    this.filters.category = event?.map((item: any) => ({ category: item.category })) || [];
    if (this.dt1) {
      this.dt1.filter(this.filters.category.map(c => c.category), 'category', 'in'); // Use 'in' filter
    }
    this.getDataWithFilters();
  }

  onBrandChange(event: any) {
    this.filters.brand = event?.map((item: any) => ({ brand: item.brand })) || [];
    if (this.dt1) {
      this.dt1.filter(this.filters.brand.map(b => b.brand), 'brand', 'in'); // Use 'in' filter
    }
    this.getDataWithFilters();
  }

  onItemGroupChange(event: any) {
    this.filters.itemGroup = event?.map((item: any) => ({ itemGroup: item.itemGroup })) || [];
    if (this.dt1) {
      this.dt1.filter(this.filters.itemGroup.map(g => g.itemGroup), 'itemGroup', 'in'); // Use 'in' filter
    }
    this.getDataWithFilters();
  }


  onSizeChange(event: any) {
    this.filters.sizes = event?.sizes ?? null;  // Update size filter
    if (this.dt1) this.dt1.filter(this.filters.sizes, 'sizes', 'contains');
    this.getDataWithFilters();
  }

  onTypeChange(event: any) {
    this.filters.type = event?.type ?? null;  // Update type filter
    if (this.dt1) this.dt1.filter(this.filters.type, 'type', 'contains');
    this.getDataWithFilters();
  }

  filterItems() {
    if (Object.keys(this.filters).length !== 0) {
      this.localStorageService.setSessionItem(appCommon.LocalStorageKeyType.ItemFormData, this.filters);

      this.filterRecordList = this.recordList.filter(item => {
        const filterCategories = this.filters?.category?.length ? this.filters.category.map(c => c.category) : []; // Extract category values
        const filterBrands = this.filters?.brand?.length ? this.filters.brand.map(b => b.brand) : []; // Extract brand values
        const filterGroup = this.filters?.itemGroup?.length ? this.filters.itemGroup.map(b => b.itemGroup) : []; // Extract brand values

        const matchesCategory = filterCategories.length ? filterCategories.includes(item.category) : true;
        const matchesBrand = filterBrands.length ? filterBrands.includes(item.brand) : true;
        const matchesItemGroup = filterGroup.length ? filterGroup.includes(item.itemGroup) : true;
        const matchesSizes = this.filters.sizes ? item.sizes === this.filters.sizes : true;
        const matchesType = this.filters.type ? item.type === this.filters.type : true;
        const matchesUsedFor = this.filters.usedFor ? item.usedFor == this.filters.usedFor : true;

        return matchesCategory && matchesSizes && matchesType && matchesBrand && matchesItemGroup && matchesUsedFor;
      });
    } else {
      this.filterRecordList = this.recordList;
    }
  }


  clearAll() {
    this.filters = {
      category: null,
      sizes: null,
      type: null,
      brand: null,
      itemGroup: null,
      usedFor: 1,
    };
    if (this.dt1) this.dt1.filter(this.filters.category, 'category', 'contains');
    if (this.dt1) this.dt1.filter(this.filters.sizes, 'sizes', 'contains');
    if (this.dt1) this.dt1.filter(this.filters.type, 'type', 'contains');
    if (this.dt1) this.dt1.filter(this.filters.brand, 'brand', 'contains');
    if (this.dt1) this.dt1.filter(this.filters.itemGroup, 'itemGroup', 'contains');
    this.filterItems();
  }

  onSelectProduct(selectedProduct: any) {
    this.onItemPOSClick.emit(selectedProduct);
  }

  async onCategoryClick(selectedCategory: any) {
    const existingIndex = this.filters.category?.findIndex(c => c.category === selectedCategory.category);

    if (existingIndex > -1) {
      this.filters.category.splice(existingIndex, 1);
      selectedCategory.isSelected = false;
    } else {
      if (!this.filters.category) this.filters.category = [];
      this.filters.category.push(selectedCategory);
      selectedCategory.isSelected = true;
    }

    if (this.filters.category.length) {
      await this.filterItems();
      this.getDistinctValues();
    } else {
      this.clearFilters();
    }
  }

  async clearFilters() {
    this.filters.brand = [];
    this.brands.forEach(v => { v.isSelected = false });

    this.filters.itemGroup = [];
    this.itemGroups.forEach(v => { v.isSelected = false });

    this.localStorageService.setSessionItem(appCommon.LocalStorageKeyType.ItemFormData, this.filters);

    await this.filterItems();
  }

  onBrandClick(selectedBrand: any) {
    const existingIndex = this.filters.brand?.findIndex(b => b.brand === selectedBrand.brand);

    if (existingIndex > -1) {
      this.filters.brand.splice(existingIndex, 1);
      selectedBrand.isSelected = false;
    } else {
      if (!this.filters.brand) this.filters.brand = [];
      this.filters.brand.push(selectedBrand);
      selectedBrand.isSelected = true;
    }

    this.filterItems();

    this.getDistinctValues();
  }

  onGroupClick(selectedGroup: any) {
    const existingIndex = this.filters.itemGroup?.findIndex(b => b.itemGroup === selectedGroup.itemGroup);

    if (existingIndex > -1) {
      this.filters.itemGroup.splice(existingIndex, 1);
      selectedGroup.isSelected = false;
    } else {
      if (!this.filters.itemGroup) this.filters.itemGroup = [];
      this.filters.itemGroup.push(selectedGroup);
      selectedGroup.isSelected = true;
    }

    this.filterItems();

    this.getDistinctValues();
  }

  clearFilterForm() {
    this.localStorageService.removeItem(appCommon.LocalStorageKeyType.ItemFormData);
    this.filters = { category: [], brand: [], itemGroup: [], showCategory: true };
    this.brands.forEach(v => { v.isSelected = false });
    this.itemGroups.forEach(v => { v.isSelected = false });
    this.categories.forEach(v => { v.isSelected = false });
    this.filterItems();
  }

  setCategoryFilter(value: boolean) {
    this.filters.showCategory = value;
    if (!value) {
      this.categories.forEach(v => { v.isSelected = false });
      this.filters.category = [];

      this.setBrandFilter(false);
      this.setItemGroupFilter(false);
    } else {
      this.filterItems();
    }
  }

  setBrandFilter(value: boolean) {
    this.filters.showBrand = value;
    if (!value) {
      this.brands.forEach(v => { v.isSelected = false });
      this.filters.brand = [];
    }

    this.filterItems();
  }

  setisQtyAddOnPopup(value: boolean) {
    this.filters.isQtyAddOnPopup = value;
    this.localStorageService.setSessionItem(appCommon.LocalStorageKeyType.ItemFormData, this.filters);
  }

  setItemGroupFilter(value: boolean) {
    this.filters.showItemGroup = value;
    if (!value) {
      this.itemGroups.forEach(v => { v.isSelected = false });
      this.filters.itemGroup = [];
    }

    this.filterItems();
  }

  getDynamicHeight(): string {

    const { showCategory, showBrand, showItemGroup } = this.filters;

    const visibleCategoryData = showCategory;
    const visibleBrandData = (visibleCategoryData && showBrand && this.categories.some(p => p.isSelected)) || (showBrand && this.filters.brand.length > 0);

    const visibleItemGroupData =
      (visibleCategoryData && visibleBrandData && showItemGroup) ||
      (visibleCategoryData && showItemGroup && this.itemGroups.length > 0 && this.categories.some(p => p.isSelected)) ||
      ((visibleCategoryData || visibleBrandData) && (this.filters.itemGroup.length > 0 && this.itemGroups.length > 0)) ||
      ((visibleCategoryData || visibleBrandData) && showItemGroup && this.itemGroups.some(p => p.isSelected));

    const activeFilterCount = [visibleCategoryData, visibleBrandData, visibleItemGroupData].filter(Boolean).length;
    if (activeFilterCount === 3) return '49vh'; // All filters visible with data
    if (activeFilterCount === 2) return '59vh'; // Two filters visible with data
    if (activeFilterCount === 1) return '68vh'; // One filter visible with data

    return '78vh'; // No filters visible or no data
  }


}
