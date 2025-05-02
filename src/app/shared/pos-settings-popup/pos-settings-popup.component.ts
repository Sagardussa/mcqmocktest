import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { LocalStorageServiceService } from 'src/app/providers/services/local-storage-service.service';

@Component({
  selector: 'app-pos-settings-popup',
  templateUrl: './pos-settings-popup.component.html',
  styleUrls: ['./pos-settings-popup.component.scss']
})

export class PosSettingsPopupComponent implements OnInit {

  recordData: any;
  isOnItEvent: boolean = false;
  // loginSuccessSubscription: Subscription;
  invType: any;
  type: any;
  ledgers: any = [];
  logoPreview: string | null = null;

  @Input() formResult: any = {};
  selectedFile: File;
  public appCommon = appCommon;
  isBtnLoading: boolean = false;
  form: FormGroup;
  isPrintBtnLoading: boolean = false;
  @Input() public data;
  userData: any = {};
  selectedFiles: File[] = [];
  setupInfoData: any;
  isSubmitted: boolean = false;
  sessionId: any;
  selectedFileName: string = '';
  printSettings: any;
  currentCompany: ICompanyViewModel;

  constructor(
    companyResolver: CompanyResolver,
    private localStorageService: LocalStorageServiceService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authServiceService: AuthServiceService,) {
    this.currentCompany = companyResolver.getCurrentCompany();
    var token = this.authServiceService.getTokenInfo();
    this.printSettings = this.authServiceService.getPrintSettings();
    this.sessionId = token.user.currentSessionId;
    this.getUserData();
    this.createForm();
  }

  ngOnInit(): void {
    this.setupInfoData = this.data.setupInfoData;
    this.invType = this.data.invType;
    this.type = this.data.type;
    this.recordData = this.data.recordData;
    const savedSettings = this.printSettings;
    if (savedSettings) {
      const settings = typeof savedSettings === 'string' ? JSON.parse(savedSettings) : savedSettings;

      this.form.patchValue({
        printLanguage: settings.printLanguage || 1,
        printWidth: settings.printWidth || '216',
        isImageRequired: settings.isImageRequired || false,
        isRateRequired: settings.isRateRequired || false,
        itemListPlacement: settings.itemListPlacement || 'left', // Load saved value or default to 'left'
        fontSize: settings.fontSize || '14px',  // ✅ Load saved font size
        isBold: settings.isBold || false   
      });
    }

  }


  clear() {
    // Remove logo file and name from local storage
    this.localStorageService.removeItem(appCommon.LocalStorageKeyType.LogoFile);

    // Reset component properties
    this.selectedFile = null;

    // Reset the file input in the form
    this.form.patchValue({ files: '' });

    if (!this.selectedFileName) {
      return;
    } {
      this.send();
    }
  }


  base64ToFile(base64: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], '', { type: mime });
  }

  getUserData() {
    this.userData = this.authServiceService.getTokenInfo().user;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const fileType = file.type;

    if (fileType.startsWith('image/') && file.size > 51200) {
      alert('Image size exceeds 50KB limit. Please select a smaller image.');
      event.target.value = null;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result as string;

        // Save both the file content and file name to local storage
        this.localStorageService.setItem(appCommon.LocalStorageKeyType.LogoFile, base64File);

        this.selectedFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(): void { }

  createForm() {
    this.form = this.fb.group({
      printLanguage: [null],
      printWidth: [null],
      files: [''],
      isImageRequired: [false],
      isRateRequired: [false],
      itemListPlacement: ['left'], // Default value
      fontSize: ['14px'], // Default value
      isBold: [false],    // Default value
    });
  }

  passBack() {
    this.activeModal.close();
  }

  get formData() { return this.form.controls; }

  async send() {
    if (this.form.invalid) {
      return;
    }
    const formValues = this.form.value;

    // Check if the Base64 logo is valid
    const logoFile = this.localStorageService.getItem(appCommon.LocalStorageKeyType.LogoFile);

    const printSettings = {
      isImageRequired: formValues.isImageRequired,
      isRateRequired: formValues.isRateRequired,
      printLanguage: formValues.printLanguage,
      printWidth: formValues.printWidth,
      logoFile: logoFile || '', // Directly fetch from local storage
      itemListPlacement: formValues.itemListPlacement, // Save the radio button value
      fontSize: formValues.fontSize,  // ✅ Store font size
      isBold: formValues.isBold   
    };
    this.localStorageService.setItem(appCommon.LocalStorageKeyType.PrintSettings, printSettings);
    this.activeModal.dismiss();
  }

  getImagePreview(): string {
    const base64Logo = this.localStorageService.getItem(appCommon.LocalStorageKeyType.LogoFile);
    if (base64Logo && typeof base64Logo === 'string') {
      return base64Logo; // Return the base64 logo directly
    }
    return ''; // Return an empty string if no image is found
  }

  previewFile(file: File) {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  }
}
