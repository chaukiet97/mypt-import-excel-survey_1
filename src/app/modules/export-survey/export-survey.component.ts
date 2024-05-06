import { SafetyService } from './../../shared/service/safety.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM / YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@Component({
  selector: 'app-export-survey',
  templateUrl: './export-survey.component.html',
  styleUrls: ['./export-survey.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ExportSurveyComponent implements OnInit {
  formExport: FormGroup
  keys: string[];
  dataSheet: any;
  resultsLength = 0;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private safetyService: SafetyService,
  ) { }

  ngOnInit(): void {
    this.formExport = this.formBuilder.group({
      start_at: ['', [Validators.required]],
      end_at: ['', [Validators.required]],
      survey_type: ['', [Validators.required]],
      id: ['', [Validators.required]],
    })
  }
  exportReport() {
    if (this.formExport.value['survey_type'] === "normal") {
      let payload = {
        "from_date": this.formExport.value['start_at'],
        "to_date": this.formExport.value['end_at'],
        "schedule_id": Number(this.formExport.value['id'])
      }
      this.safetyService.exportSurvey(payload).subscribe((res: any) => {
        if (res.status === 1) {
          let finalData: any[] = []
          this.dataSheet = res.data.data
          this.keys = Object.keys(res.data.data)
          this.resultsLength = this.dataSheet[this.keys[0]].length
          for (let i = 0; i < this.resultsLength; i++) {
            const item = {};
            Object.keys(this.dataSheet).forEach((key) => {
              item[key] = this.dataSheet[key][i];
            });
            finalData.push(item);
          }
          this.dataSource = new MatTableDataSource(finalData)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.sort.active
          this.sort.direction
          this.paginator.pageIndex=0
          let file_name = `${res.data.schedule['survey_title']}_${res.data.schedule['start_at']}_${moment().format('DD-MM-YYYY')}`
          let wb = XLSX.utils.book_new();
          let ws = XLSX.utils.json_to_sheet(finalData);
          XLSX.utils.book_append_sheet(wb, ws);
          XLSX.writeFile(wb, `${file_name}.xlsx`);
        }
      })
    }
    if (this.formExport.value['survey_type'] === "labor_safety") {
      let payload = {
        "from_date": moment(this.formExport.value['start_at']).format("YYYY-MM-DD"),
        "to_date": moment(this.formExport.value['end_at']).format("YYYY-MM-DD"),
        "id": Number(this.formExport.value['id'])
      }
      this.safetyService.exportSafety(payload).subscribe((res: any) => {
        if (res.status === 1) {
          let finalData: any[] = []
          this.dataSheet = res.data.data
          this.keys = Object.keys(res.data.data)
          this.resultsLength = this.dataSheet[this.keys[0]].length
          for (let i = 0; i < this.resultsLength; i++) {
            const item = {};
            Object.keys(this.dataSheet).forEach((key) => {
              item[key] = this.dataSheet[key][i];
            });
            finalData.push(item);
          }
          this.dataSource = new MatTableDataSource(finalData)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.sort.active
          this.sort.direction
          this.paginator.pageIndex=0
          let file_name = `${res.data.title['title']}_${res.data.title['from_date']}_${moment().format('DD-MM-YYYY')}`
          let wb = XLSX.utils.book_new();
          let ws = XLSX.utils.json_to_sheet(finalData);
          XLSX.utils.book_append_sheet(wb, ws);
          XLSX.writeFile(wb, `${file_name}.xlsx`);
        }
      })
    }
  }
}
