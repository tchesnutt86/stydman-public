import { Injectable } from '@angular/core';
import { UserPermissions } from '../models/common/user-permissions.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private _initialized: boolean;
  private _hasWriteAccess: boolean;
  private _menuAdvanced: boolean;

  constructor() { }

  setUser(username: string) {
    switch (username) {
      case 'cwcviewer':
        this._hasWriteAccess = false;
        this._menuAdvanced = false;
        break;
      case 'cwcmember':
        this._hasWriteAccess = true;
        this._menuAdvanced = false;
        break;
      case 'cwcadmin':
        this._hasWriteAccess = true;
        this._menuAdvanced = true;
        break;
      default:
        this._hasWriteAccess = false;
        this._menuAdvanced = false;
    }

    this._initialized = true;
  }

  getPermissions(): UserPermissions {
    return <UserPermissions>{
      hasWriteAccess: this._hasWriteAccess,
      menuAdvanced: this._menuAdvanced,
    };
  }

  hasBeenInitialized(): boolean {
    return this._initialized;
  }
}
