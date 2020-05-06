import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(
    public httpClient: HttpClient
  ) { }

  public getBaseUrl(): string {
    return environment.baseDataServiceUrl;
  }

  public getView<T>(viewName: string, vendorId?: number): Observable<T> {
    if (vendorId) {
      return this.httpClient.get<T>(
        `${this.getBaseUrl()}common/getViewForVendor.php`,
        {
          params: {
            viewName,
            vendorId: vendorId.toString(),
          }
        }
      );
    } else {
      return this.httpClient.get<T>(
        `${this.getBaseUrl()}common/getView.php`,
        {
          params: {
            viewName
          }
        }
      );
    }
  }

  public get<T>(pathAndFile: string, parameters?: any): Observable<T> {
    const url = `${this.getBaseUrl()}${pathAndFile}`;

    if (parameters) {
      return this.httpClient.get<T>(
        url,
        {
          params: parameters
        }
      );
    } else {
      return this.httpClient.get<T>(url);
    }
  }

  public post(pathAndFile: string, body?: any, options?: any): Observable<any> {
    const url = `${this.getBaseUrl()}${pathAndFile}`;

    if (options) {
      return this.httpClient.post(
        url,
        body,
        options,
      );
    } else {
      return this.httpClient.post(
        url,
        body,
      );
    }
  }

}
