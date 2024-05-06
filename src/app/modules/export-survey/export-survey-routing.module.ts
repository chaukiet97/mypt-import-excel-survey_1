import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportSurveyComponent } from './export-survey.component';

const routes: Routes = [
  {
    path:"",
    pathMatch:"full",
    component:ExportSurveyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportSurveyRoutingModule { }
