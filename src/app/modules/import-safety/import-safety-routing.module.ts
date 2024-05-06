import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportSafetyComponent } from './import-safety.component';

const routes: Routes = [
  {
    path:'',
    component:ImportSafetyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportSafetyRoutingModule { }
