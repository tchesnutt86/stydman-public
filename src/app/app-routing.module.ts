import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsComponent } from './vendors/vendors.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { BerryCenterMapComponent } from './berry-center-map/berry-center-map.component';
import { VendorApplicationOptionsComponent } from './vendor-application-options/vendor-application-options.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ReportsComponent } from './reports/reports.component';
import { AdvancedComponent } from './advanced/advanced.component';

const routes: Routes = [
  { path: '', redirectTo: '/vendors', canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'vendors', component: VendorsComponent, canActivate: [AuthGuard] },
  { path: 'vendor-details/:id', component: VendorDetailsComponent, canActivate: [AuthGuard] },
  { path: 'invitations', component: InvitationsComponent, canActivate: [AuthGuard] },
  { path: 'berry-center-map', component: BerryCenterMapComponent, canActivate: [AuthGuard] },
  { path: 'vendor-application-options', component: VendorApplicationOptionsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'advanced', component: AdvancedComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
