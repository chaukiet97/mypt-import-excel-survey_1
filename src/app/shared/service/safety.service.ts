import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SafetyService {
// https://apis-stag.fpt.vn

  constructor(private http: HttpClient,) { }

  importSafety(payload): Observable<any> {
    return this.http.post<any>('https://apis.fpt.vn/mypt-ho-surveys-api/labor-safety/import', payload)
  }
  exportSafety(payload): Observable<any> {
    return this.http.post<any>('https://apis.fpt.vn/mypt-ho-surveys-api/labor-safety/report', payload)
  }
  exportSurvey(payload):Observable<any>{
    return this.http.post<any>('https://apis.fpt.vn/mypt-ho-surveys-api/survey-toolkit/export-report', payload)
  }
}
