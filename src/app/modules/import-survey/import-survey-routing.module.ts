import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportSurveyComponent } from './import-survey.component';

const routes: Routes = [
  {
    path: '',
    pathMatch:"full",
    component:ImportSurveyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportSurveyRoutingModule { }
