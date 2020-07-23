import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalenderViewComponent } from './calender-view/calender-view.component';

const routes: Routes = [{ path: 'calender', component: CalenderViewComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
