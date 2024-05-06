import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportSurveyRoutingModule } from './export-survey-routing.module';
import { ExportSurveyComponent } from './export-survey.component';


@NgModule({
  declarations: [
    ExportSurveyComponent
  ],
  imports: [
    CommonModule,
    ExportSurveyRoutingModule,
    SharedModule
  ]
})
export class ExportSurveyModule { }
