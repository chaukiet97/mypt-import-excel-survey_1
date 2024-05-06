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
interface DataExcel {
  content: string,
  question_type: string,
  group: string,
  answer: Answer[]

}
interface Answer {
  "answer_data": {
    "content": string
  },
  "is_correct": boolean
}
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
  selector: 'app-import-survey',
  templateUrl: './import-survey.component.html',
  styleUrls: ['./import-survey.component.scss'],
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
export class ImportSurveyComponent implements OnInit {

  formCreated: FormGroup
  spinnerEnabled = false;
  keys: string[];
  dataSheet: any;
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;
  dataExcel: DataExcel[]
  required: boolean = true
  file_import: string
  minDate: Date;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private safetyService: SafetyService
  ) {

  }
  ngOnInit(): void {
    // const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.formCreated = this.formBuilder.group({
      unit_type: ['all', [Validators.required]],
      unit_name: ['all', [Validators.required]],
      start_at: ['', [Validators.required]],
      end_at: ['', [Validators.required]],
      survey_type: ['', [Validators.required]],
      title: ['', [Validators.required]],
      required: [this.required, [Validators.required]],
    })
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  get typeSurvey() {
    return this.formCreated.get('survey_type')
  }

  onChange(evt) {
    this.isLoadingResults = true;
    let data, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (this.isExcelFile) {

      // this.inputFile.nativeElement.value = target.files[0].name
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);
        this.keys = Object.keys(data[0]);
        this.dataSheet = data
        console.log(data);
        this.resultsLength = data.length

        if (this.typeSurvey && this.typeSurvey['value'] == 'labor_safety') {


          this.dataExcel = this.convertData(data)
          // console.log(this.dataExcel);
          for (let index = 0; index < data.length; index++) {
            let indexQuestion: number = 1
            if (data[index][`Câu trả lời ${indexQuestion}`]) {
              if (data[index]['Loại đáp án đúng'] == 1) {
                data[index][`Câu trả lời ${data[index]['Đáp án đúng']}`] = `<div style="color:red">${data[index][`Câu trả lời ${data[index]['Đáp án đúng']}`]}</div>`
              }
              else {
                let lengthfCorrect = this.mapCorrect(data[index]['Đáp án đúng'])
                for (let j = 0; j < lengthfCorrect.length; j++) {
                  data[index][`Câu trả lời ${lengthfCorrect[j]}`] = `<div style="color:red">${data[index][`Câu trả lời ${lengthfCorrect[j]}`]}</div>`
                }
              }
              indexQuestion = indexQuestion + 1
            }
          }

        }
        else {
          this.dataExcel = this.convertDataNormal(data)
          console.log(this.dataExcel);

        }
        this.dataSource = new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.active
        this.sort.direction
        this.paginator.pageIndex
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.isLoadingResults = false
        this.isRateLimitReached = data === null
        this.file_import = target.files[0].name
        this.spinnerEnabled = false
      }

    } else {
      this._snackBar.open(`File ${target.files[0].name} không đúng định dạng `, 'Đóng', {
        duration: 2000
      })
      this.inputFile.nativeElement.value = '';
    }

  }
  deleteFile() {
    location.reload()
  }
  convertData(data) {
    let dataFinal = []
    data.forEach(list => {

      dataFinal.push({
        "content": list['Nội dung câu hỏi'],
        "question_type": this.convertInputType(list['Loại đáp án đúng']),
        "question_group": list['Nhóm câu hỏi'] || list['Nhóm'],
        "answers": this.convertAnswer(list),
        "sub_content": "",
        "media_url": null,
        "media_type": null,
        "extra_data": {},
        "allow_freedom_answer": false,
        "required": true
      })
    });
    return dataFinal;
  }
  convertDataNormal(data) {
    let dataFinal = []
    data.forEach(list => {

      dataFinal.push({
        "content": list['Nội dung câu hỏi'],
        "question_type": this.convertInputType(list['Loại Câu Hỏi']),
        "question_group": 'null',
        "answers": list['Loại Câu Hỏi'] != "Nhập" ? this.convertAnswerNormal(list) : [],
        "sub_content": "",
        "media_url": null,
        "media_type": null,
        "extra_data": {},
        "allow_freedom_answer": true,
        "required": list['Trạng Thái'] === "Bắt buộc" ? true : false
      })
    });
    return dataFinal;

  }
  convertInputType(value) {
    let type = 'text'
    if (this.typeSurvey['value'] == 'labor_safety') {
      if (value === 1)
        type = 'radio'
      type = 'checkbox'
    } else {
      switch (value) {
        case 'Chọn một':
          type = 'radio'
          break;
        case 'Chọn nhiều':
          type = 'checkbox'
          break;
        default:
          type = 'text'
          break;
      }
    }
    return type
  }
  convertAnswerNormal(data) {
    let index: number = 0
    let answerData: any = []
    Object.keys(data).forEach(item => {
      index = index + 1
      if (data[`Câu trả lời ${index}`]) {
        answerData.push({
          "answer_data": {
            "content": data[`Câu trả lời ${index}`].trim()
          },
          "is_correct": true
        })
      }
    });
    return answerData
  }
  convertAnswer(data) {
    let index: number = 0
    let answerData: any=[]
    Object.keys(data).forEach(item => {
      index = index + 1
      if (data[`Câu trả lời ${index}`]) {
        if (data['Loại đáp án đúng'] == 1) {
          answerData.push({
            "answer_data": {
              "content": data[`Câu trả lời ${index}`]
            },
            "is_correct": index == data['Đáp án đúng'] ? true : false
          })
        }
        else {
          answerData.push({
            "answer_data": {
              "content": data[`Câu trả lời ${index}`]
            },
            "is_correct": this.mapCorrect(data['Đáp án đúng']).includes(index) ? true : false
          })
        }
      }
    });
    return answerData
  }

  mapCorrect(data) {
    return data.split(',').map(function (item) {
      return parseInt(item, 10);
    })
  }
  submitFileImport() {
    let schedules = [
      {
        "unit_type": this.formCreated.value['unit_type'],
        "unit_name": this.formCreated.value['unit_name'],
        "start_at": moment(this.formCreated.value['start_at']).format("YYYY-MM-DD HH:mm:ss"),
        "end_at": moment(this.formCreated.value['end_at']).format("YYYY-MM-DD HH:mm:ss"),
        "platform": "web",
        "published": true
      }
    ]
    let paths = [
      {
        "questions": this.dataExcel,
        "title": null,
        "sub_title": "",
        "summary": "",
        "ordinal": 32767
      }
    ]
    let payload_safety = {
      "schedules": schedules,
      "paths": paths,
      "author_id": 2147483647,
      "survey_type": this.formCreated.value['survey_type'],
      "title": this.formCreated.value['title'],
      "sub_title": "",
      "desc": "",
      "summary": "",
      "media_url": null,
      "media_type": null,
      "allow_anonymous": true,
      "is_required": this.formCreated.value['required']
    }
    this.safetyService.importSafety(payload_safety).subscribe((res: any) => {
      if (res.status === 1) {
        this._snackBar.open("Import Thành Công", "Thoát", {
          duration: 2000
        })
        setTimeout(() => {
          location.reload()
        }, 2500);
      }
      else {
        this._snackBar.open(res.message, '', {
          duration: 2000,
        })
      }
    })

  }

}
