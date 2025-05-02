import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { CommonService } from 'src/app/providers/services/common.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
@Component({
  selector: 'app-group-selection',
  templateUrl: './group-selection.component.html',
  styleUrls: ['./group-selection.component.scss']
})
export class GroupSelectionComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() label: string;
  @Input() itemControl: string;
  @Output() itemChange: EventEmitter<any> = new EventEmitter();
  @Output() itemReset: EventEmitter<any> = new EventEmitter();
  loginSuccessSubscription: Subscription;
  isOnItEvent: boolean = false;
  itemsFiltered: Observable<any[]> | undefined;
  groups: any[];


  group: FormControl = new FormControl(null);

  constructor(private commonService: CommonService,private recordCreationService: RecordCreationService) { 
    this.loginSuccessSubscription = recordCreationService.loginSuccessEventChanged$.subscribe(record => {
      if (this.isOnItEvent)
        this.listGroup();
    });
  }

  ngOnInit(): void {
   
    this.isOnItEvent = true;
    this.listGroup();
  }

  ngOnDestroy(): void {
    this.loginSuccessSubscription.unsubscribe();
  }

  addnew() {
    // Add new Functionality
  }
  selectItem(id: number) {
    const _item = this.groups.find((item) => item.id === id);
    this.group?.patchValue(_item);
  }

  panelClosed() {
    if (typeof this.group?.value === 'string') {
      this.group?.patchValue(null);
      this.form?.get(this.itemControl)?.patchValue(null);
    }
  }

   onItemSelected(event: any) {
     if (event.item?.id) {
       this.form?.get(this.itemControl)?.patchValue(event.item.id);
       this.itemChange?.emit(event.item?.id);
     }
   }

  resetItem() {
    this.group?.reset();
    this.form.get(this.itemControl)?.reset();
    this.itemReset?.emit();
    this.onChange();
  }

  onChange() {
    // this.itemsFiltered = this.group?.valueChanges.pipe(
    //   startWith(''),
    //   map((value) => (typeof value === 'string' ? value : value?.name || '')),
    //   map((value) => (value?.length >= 0 ? this._filter(value) : []))
    // );
  }

  // private _filter(value: string): any[] {
  //   const filterValue = value.toLowerCase();
  //   return this.groups.filter((item) => item.name.toLowerCase().includes(filterValue));
  // }

  groupSelectionFormatter = (x: { name: string }) => x.name;

  groupSelectionFilter: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.groups
            .filter(
              (v: any) =>
                v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10)
      )
    );

  displayFn(ledger: any): string {
    return ledger && ledger.name ? ledger.name : '';
  }

  listGroup(): void {
    var fdata = {
      table: 10
    }
    this.commonService.dropdown(fdata)
      .subscribe(
        data => {
          this.groups = data;
          this.onChange();

          if (this.form.get(this.itemControl)?.value) {
            this.selectItem(this.form.get(this.itemControl)?.value);
          }
          this.isOnItEvent = false;
        }
      )
  }
}
