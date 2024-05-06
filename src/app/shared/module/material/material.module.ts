import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';

const MODULE = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatSortModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatIconModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...MODULE
  ],
  exports: [
    ...MODULE
  ]
})
export class MaterialModule { }
