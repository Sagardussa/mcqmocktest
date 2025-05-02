import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable, OperatorFunction, Subscription, of } from 'rxjs';
import { ItemServiceService } from 'src/app/providers/services/item-service.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { appCommon } from 'src/app/common/_appCommon';
import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';
import { MasterSyncService } from 'src/app/providers/services/master-sync.service';
import { KeyCode } from 'ag-grid-community';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';

@Component({
  selector: 'app-item-selection',
  templateUrl: './item-selection.component.html',
  styleUrls: ['./item-selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemSelectionComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() label: string;
  @Input() item: string;
  @Input() id: string;
  @Output() tabpressed: EventEmitter<any> = new EventEmitter();
  @Output() itemChange: EventEmitter<any> = new EventEmitter();
  @Output() itemReset: EventEmitter<any> = new EventEmitter();
  @Output() onTabClickEmit: EventEmitter<any> = new EventEmitter();
  @Output() onShiftClickEmit: EventEmitter<any> = new EventEmitter();
  itemList: any[] = [];
  @Input() itemsFiltered: Observable<any[]> | undefined;
  @ViewChild('typehead', { read: ElementRef }) myInput: ElementRef<HTMLInputElement>;
  isOnItEvent: boolean = false;
  itemSyncEventCompletedSubscription: Subscription;
  public appCommon = appCommon;
  loginSuccessSubscription: Subscription;
  currentCompany: ICompanyViewModel;
  selectedRackName: string | null = null;

  constructor(private itemServiceService: ItemServiceService,
    private recordCreationService: RecordCreationService,
    private localStorageService: LocalStorageServiceService,
    private masterSyncService: MasterSyncService,
    companyResolver: CompanyResolver) {

    this.currentCompany = companyResolver.getCurrentCompany();
    this.loginSuccessSubscription = recordCreationService.loginSuccessEventChanged$.subscribe(() => {
      if (this.isOnItEvent) {
        if (this.currentCompany.businessType != 23) this.masterSyncService.SyncItems();
      }
    });

    this.itemSyncEventCompletedSubscription = recordCreationService.itemSyncEventCompleted$.subscribe(() => {
      var list = this.localStorageService.getItem(appCommon.LocalStorageKeyType.ItemList);
      // Sort the list safely by 'ict', treating null/undefined as empty strings
      if (list.length) {
        list = list.sort((a, b) => {
          const aIct = a.ict || '';  // If 'ict' is null or undefined, use an empty string
          const bIct = b.ict || '';  // Same for 'b.ict'
          return aIct.localeCompare(bIct);  // Safe localeCompare
        });

        this.itemList = [];
        for (let ele of list) {
          if (ele.isact && ele.uf !== 25) {
            const searchableFields = [ele.nm, ele.ict, ele.typ, ele.brd, ele.siz, ele.ig].filter(Boolean);
            ele.particular = searchableFields.join(" ").toLowerCase();
            this.itemList.push(ele);
          }
        }
      }
      this.isOnItEvent = false;
    });
  }

  ngOnInit(): void {
    this.isOnItEvent = true;
    if (this.currentCompany.businessType != 23) this.masterSyncService.SyncItems();
    if (this.form.get(this.id)?.value) {
      this.selectItem(this.form.get(this.id)?.value);
    }
  }

  ngOnDestroy(): void {
    this.loginSuccessSubscription.unsubscribe();
    this.itemSyncEventCompletedSubscription.unsubscribe();
  }

  panelClosed() {
    if (typeof this.form?.get(this.item)?.value === 'string') {
      this.form?.get(this.item)?.patchValue(null);
      this.form?.get(this.id)?.patchValue(null);
    }
  }

  selectItem(id: number) {
    const _item = this.itemList.find((item) => item.iid === id);
    this.form.get(this.item)?.patchValue(_item);
  }

  onItemSelected(event) {
    const selectedItem = event.item;
    this.form?.get(this.id)?.patchValue(selectedItem.iid);
    this.selectedRackName = selectedItem.rckloc || null;
    this.itemChange?.emit();
    this.recordCreationService.announItemChange(selectedItem);
    if (KeyCode.TAB === 9) {
      this.tabpressed?.emit();
    }
  }

  onInputChange(value: string): void {
    if (!value) {
      this.selectedRackName = null;
    }
  }

  resetItem() {
    setTimeout(() => {
      this.form?.get(this.id)?.reset();
      this.form?.get(this.item)?.reset();
      this.itemReset?.emit();
    }, 250);
  }

  itemSelectionFilter: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < 3) {
          return of([]);
        }

        const terms = term.toLowerCase().split(" ");
        const lowerTerm = term.toLowerCase();

        // Fetch items based on current business type
        if (this.currentCompany.businessType === 23) {
          return this.itemServiceService.getAutoCompleteItems(term).pipe(
            map(items =>
              items
                .map(item => {

                  // Skip items where uf == 25
                  if (item.uf == 25) return null; // Skip this item

                  let relevance = 0;

                  // Define weights for each field
                  const weights = {
                    nm: 5,
                    ict: 4,
                    typ: 8,
                    brd: 7,
                    cat: 10,
                    siz: 3,
                    ig: 2
                  };

                  // Full term match boosts relevance significantly
                  if (item.cat?.toLowerCase().includes(lowerTerm)) relevance += weights.cat * 3;
                  if (item.brd?.toLowerCase().includes(lowerTerm)) relevance += weights.brd * 3;
                  if (item.typ?.toLowerCase().includes(lowerTerm)) relevance += weights.typ * 3;
                  if (item.nm?.toLowerCase().includes(lowerTerm)) relevance += weights.nm * 3;

                  // Calculate dynamic relevance based on individual terms
                  terms.forEach(term => {
                    if (term.length >= 3) {
                      if (item.nm?.toLowerCase().includes(term)) relevance += weights.nm;
                      if (item.ict?.toLowerCase().includes(term)) relevance += weights.ict;
                      if (item.typ?.toLowerCase().includes(term)) relevance += weights.typ;
                      if (item.brd?.toLowerCase().includes(term)) relevance += weights.brd;
                      if (item.cat?.toLowerCase().includes(term)) relevance += weights.cat;
                      if (item.siz?.toLowerCase().includes(term)) relevance += weights.siz;
                      if (item.ig?.toLowerCase().includes(term)) relevance += weights.ig;
                    }
                  });

                  // Apply a boost if the item type matches any part of the search term
                  const matchedTypes = terms.filter(term => item.typ?.toLowerCase().includes(term));
                  if (matchedTypes.length > 0) {
                    relevance += matchedTypes.length * 10; // Adjust boost as needed
                  }

                  return { ...item, relevance };
                })
                .filter(item => item.relevance > 0) // Only include items with relevance
                .sort((a, b) => b.relevance - a.relevance) // Sort by highest relevance
                .slice(0, 50) // Limit to top 10 matches
            )
          );
        } else {
          // Apply relevance-based filtering for local data
          return of(
            this.itemList
              .map(item => {
                let relevance = 0;

                // Define weights for each field
                const weights = {
                  nm: 5,
                  ict: 4,
                  typ: 8,
                  brd: 7,
                  cat: 10,
                  siz: 3,
                  ig: 2
                };

                // Full term match boost
                if (item.cat?.toLowerCase().includes(lowerTerm)) relevance += weights.cat * 3;
                if (item.brd?.toLowerCase().includes(lowerTerm)) relevance += weights.brd * 3;
                if (item.typ?.toLowerCase().includes(lowerTerm)) relevance += weights.typ * 3;
                if (item.nm?.toLowerCase().includes(lowerTerm)) relevance += weights.nm * 3;

                // Calculate dynamic relevance based on individual terms
                terms.forEach(term => {
                  if (term.length >= 3) {
                    if (item.nm?.toLowerCase().includes(term)) relevance += weights.nm;
                    if (item.ict?.toLowerCase().includes(term)) relevance += weights.ict;
                    if (item.typ?.toLowerCase().includes(term)) relevance += weights.typ;
                    if (item.brd?.toLowerCase().includes(term)) relevance += weights.brd;
                    if (item.cat?.toLowerCase().includes(term)) relevance += weights.cat;
                    if (item.siz?.toLowerCase().includes(term)) relevance += weights.siz;
                    if (item.ig?.toLowerCase().includes(term)) relevance += weights.ig;
                  }
                });

                // Apply a boost if the item type matches any part of the search term
                const matchedTypes = terms.filter(term => item.typ?.toLowerCase().includes(term));
                if (matchedTypes.length > 0) {
                  relevance += matchedTypes.length * 10; // Adjust boost as needed
                }

                return { ...item, relevance };
              })
              .filter(item => item.relevance > 0)
              .sort((a, b) => b.relevance - a.relevance)
              .slice(0, 50) // Limit to top 10 matches
          );
        }
      })
    );

  itemSelectionFormatter = (x: { nm: string, ict: string }) => (x.ict ? x.ict : "") + " " + (x.nm ? x.nm : "");

  onTabClick() { if (!this.form.value.item) this.onTabClickEmit?.emit(); }

  onShiftClick() { this.onShiftClickEmit?.emit(); }
}
