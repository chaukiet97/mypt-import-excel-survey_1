import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportSafetyRoutingModule } from './import-safety-routing.module';
import { ImportSafetyComponent } from './import-safety.component';


@NgModule({
  declarations: [
    ImportSafetyComponent
  ],
  imports: [
    CommonModule,
    ImportSafetyRoutingModule,
    SharedModule
  ]
})
export class ImportSafetyModule { }
