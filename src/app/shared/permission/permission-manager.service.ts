import { Injectable } from "@angular/core";
import { appCommon } from "src/app/common/_appCommon";
import { LocalStorageServiceService } from "src/app/providers/services/local-storage-service.service";

@Injectable({
  providedIn: "root",
})
export class PermissionManagerService {
  public appCommon = appCommon;

  constructor(private localStorageServiceService: LocalStorageServiceService) { }

  isGranted(permission: any) {
    var rec = this.localStorageServiceService.getItem(
      this.appCommon.LocalStorageKeyType.TokenInfo
    );
    var permissions = rec.rights;
    if (permissions && permissions.length) {
      for (let perm of permissions) {
        if (perm.right_ID === permission) {
          return true;
        }
      }
    }
    return false;
  }

  isGrantedMultiple(lst: any) {
    var rec = this.localStorageServiceService.getItem(
      this.appCommon.LocalStorageKeyType.TokenInfo
    );
    var val = false;
    var permissions = rec.rights;
    permissions.forEach((x) => {
      lst.forEach((element) => {
        if (x.right_ID === element) {
          val = true;
        }
      });
    });
    return val;
  }
}
