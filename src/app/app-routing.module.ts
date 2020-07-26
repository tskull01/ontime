import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalenderViewComponent } from './calender-view/calender-view.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'calendar', component: CalenderViewComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
