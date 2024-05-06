import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './module/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SafipipePipe } from './pipe/safipipe.pipe';
const MODULE=[
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  CommonModule,
  MaterialModule
]
const COMPONENT=[
  SafipipePipe
]

@NgModule({
  declarations: [
    ...COMPONENT,
  ],
  imports: [
    ...MODULE
  ],
  exports:[
  ...COMPONENT, ...MODULE
  ]
})
export class SharedModule { }
