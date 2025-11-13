import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotifierSetting, DailyReport } from '../models/notifier.model';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {
  constructor(private http: HttpClient) {}

  getNotifierSettings(): Observable<NotifierSetting[]> {
    return this.http.get<NotifierSetting[]>(`${environment.apiUrl}/notifiers`);
  }

  updateNotifierSetting(notifierName: string, isEnabled: boolean): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notifiers`, {
      notifierName,
      isEnabled
    });
  }

  getDailyReport(date?: string): Observable<DailyReport> {
    const url = date 
      ? `${environment.apiUrl}/reports/daily?date=${date}`
      : `${environment.apiUrl}/reports/daily`;
    return this.http.get<DailyReport>(url);
  }

  getWeeklyReport(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/reports/weekly`);
  }

  public triggerDailyReport(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reports/daily/trigger`, {});
  }

  public triggerWeeklyReport(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/reports/weekly/trigger`, {});
  }
}