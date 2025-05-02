import { Component, Input, OnInit } from '@angular/core';
import { CompanyResolver } from 'src/app/core/helpers/company-resolver';
import { ICompanyViewModel } from 'src/app/core/interfaces/company';

@Component({
  selector: 'app-common-autocomplete-template',
  templateUrl: './common-autocomplete-template.component.html',
  styleUrls: ['./common-autocomplete-template.component.scss']
})
export class CommonAutocompleteTemplateComponent implements OnInit {
  @Input() result: any;
  @Input() templateType: string ;
  currentCompany: ICompanyViewModel;
  constructor(companyResolver: CompanyResolver) { 
    this.currentCompany = companyResolver.getCurrentCompany();
  }

  ngOnInit(): void {
  }

}
