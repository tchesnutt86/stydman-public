import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { VendorsModule } from './vendors/vendors.module';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { VendorDetailsModule } from './vendor-details/vendor-details.module';
import { InvitationsModule } from './invitations/invitations.module';
import { BerryCenterMapModule } from './berry-center-map/berry-center-map.module';
import { VendorApplicationOptionsModule } from './vendor-application-options/vendor-application-options.module';
import { SideNavigationMenuComponent } from './side-navigation-menu/side-navigation-menu.component';
import { LoginModule } from './login/login.module';
import { ReportsModule } from './reports/reports.module';
import { AdvancedModule } from './advanced/advanced.module';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    SideNavigationMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedComponentsModule,
    VendorsModule,
    VendorDetailsModule,
    InvitationsModule,
    BerryCenterMapModule,
    VendorApplicationOptionsModule,
    LoginModule,
    ReportsModule,
    AdvancedModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
