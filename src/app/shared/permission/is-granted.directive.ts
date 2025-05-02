import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionManagerService } from './permission-manager.service';

@Directive({
  selector: '[appIsGranted]'
})
export class IsGrantedDirective {

  isAllowed: boolean = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionManagerService: PermissionManagerService,
  ) { }

  @Input() set appIsGranted(permission: any) {
    this.isGranted(permission);
  }

  private isGranted(permission: any) {
    this.viewContainer.clear();
    permission.forEach((v: any) => {
      if (this.permissionManagerService.isGranted(v)) {
        this.isAllowed = true;
      }
    });

    if (this.isAllowed) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
