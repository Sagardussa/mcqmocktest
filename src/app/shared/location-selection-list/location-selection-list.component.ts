import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { appCommon } from "src/app/common/_appCommon";
import { CommonService } from "src/app/providers/services/common.service";
import { MasterValueService } from "src/app/providers/services/master-value.service";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";

@Component({
  selector: "app-location-selection-list",
  templateUrl: "./location-selection-list.component.html",
  styleUrls: ["./location-selection-list.component.scss"],
})
export class LocationSelectionListComponent implements OnInit {
  @Input() public data;
  cityList: any = [];
  stateList: any = [];
  countryList: any = [];
  recordList: any = [];
  @Output() passdata: EventEmitter<any> = new EventEmitter();
  selectedSize = { name: "Small", class: "p-datatable-sm" };
  lable: string = null;
  form: FormGroup;
  isBtnLoading: boolean = false;
  submitted: boolean = false;
  parentList: any = [];
  public appCommon = appCommon;
  selectedTab = 1;
  isTableVisible: boolean = true;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private masterValueService: MasterValueService,
    private toastrMessageService: ToastrMessageService,
    private commonService: CommonService,
    private recordCreationService: RecordCreationService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.cityList = this.data.cityList ? this.data.cityList : [];
    this.stateList = this.data.stateList ? this.data.stateList : [];
    this.countryList = this.data.countryList ? this.data.countryList : [];
    this.combineData(this.cityList);
  }

  okDialog() {
    this.closeDialog(null);
  }

  cancelDialog() {
    this.closeDialog(null);
  }

  closeDialog(data: any): void {
    this.passdata.emit({ data: data });
    this.activeModal.close();
  }

  onSelectClick(item) {
    this.closeDialog(item);
  }

  onRowSelect(item) {
    this.onSelectClick(item.data);
  }

  selectState(item): any {
    var rec = this.stateList.find((x) => x.id == item);
    return rec ? rec : null;
  }

  selectCountry(item): any {
    var rec = this.countryList.find((x) => x.id == item);
    return rec ? rec : null;
  }

  selectCity(item): any {
    var rec = this.cityList.find((x) => x.id == item);
    return rec ? rec : null;
  }

  combineData(cityList) {
    this.recordList = [];
    cityList.forEach((city) => {
      if (this.stateList.length)
        var state = this.selectState(city.field1 ? city.field1 : city.parent);
      if (this.countryList.length)
        if (state) var country = this.selectCountry(state.field1);
      if (city.text) city.name = city.text;
      this.recordList.push({
        city: city,
        cityText: city.name,
        state: state ? state : null,
        stateText: state ? state.name : "",
        country: country ? country : null,
        countryText: country ? country.name : "",
      });
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [],
      text: [null, Validators.required],
      description: [null],
      type: [null, Validators.required],
      isPublished: [true],
      parent: [0],
      customFields: [null],
      shortCode: [null],
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    } else {
      this.isBtnLoading = true;
      var fdata = this.form.value;

      this.masterValueService.Create(fdata).subscribe(
        (data) => {
          this.isBtnLoading = false;
          this.toastrMessageService.showSuccess(
            "Record created successfully.",
            "Info"
          );

          var listRec = {
            table: "Master Value",
            id: data,
            text: this.form.value.text,
            description: this.form.value.description,
            type: this.form.value.type,
            isPublished: this.form.value.isPublished,
            parent: this.form.value.parent,
            customFields: this.form.value.customFields,
            shortCode: this.form.value.shortCode,
          };
          this.recordCreationService.announceInsert(listRec);
          if (listRec.type == 1) {
            this.cityList.unshift(listRec);
            this.combineData(this.cityList);
            // this.cdr.detectChanges(); // Trigger change detection
          } else if (listRec.type == 2) {
            this.stateList.unshift(listRec);
            // this.cdr.detectChanges(); // Trigger change detection
          } else if (listRec.type == 3) {
            this.countryList.unshift(listRec);
            // this.cdr.detectChanges(); // Trigger change detection
          }
          this.selectedTab = 1;
          this.clear();
        },
        (error) => {
          this.isBtnLoading = false;
          this.toastrMessageService.showInfo(error.error.message, "Info");
        }
      );
    }
  }

  onTypeSelect() {
    if (this.form.value.type == 1) {
      this.getParentList(appCommon.EnMastervaluetypelist[1].id);
      this.lable = "State";
    } else if (this.form.value.type == 2) {
      this.getParentList(appCommon.EnMastervaluetypelist[2].id);
      this.lable = "Country";
    } else {
      this.lable = null;
    }
  }

  getParentList(type) {
    var fdata = { type: type, table: 22 };
    this.commonService.dropdown(fdata).subscribe(
      (data) => {
        this.parentList = data;
      },
      (error) => {
        this.toastrMessageService.showInfo(error.error.message, "Info");
      }
    );
  }

  clear() {
    this.submitted = false;
    this.createForm();
  }

  onTabChange(event: any) {
    this.selectedTab = event.nextId;
  }
}
