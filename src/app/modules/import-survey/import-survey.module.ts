import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportSurveyRoutingModule } from './import-survey-routing.module';
import { ImportSurveyComponent } from './import-survey.component';


@NgModule({
  declarations: [
    ImportSurveyComponent
  ],
  imports: [
    CommonModule,
    ImportSurveyRoutingModule,
    SharedModule
  ]
})
export class ImportSurveyModule { }
