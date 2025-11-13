import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotifierService } from '../services/notifier.service';
import { AdminUser } from '../models/auth.model';
import { NotifierSetting, DailyReport } from '../models/notifier.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: AdminUser | null = null;
  notifierSettings: NotifierSetting[] = [];
  dailyReport: DailyReport | null = null;
  isUpdating = false;
  updateMessage = '';
  updateSuccess = false;
  isRunningDailyReport = false;
  isRunningWeeklyReport = false;
  reportTriggerMessage = '';
  reportTriggerSuccess = false;

  constructor(
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadNotifierSettings();
    this.loadDailyReport();
  }

  loadNotifierSettings(): void {
    this.notifierService.getNotifierSettings().subscribe({
      next: (settings) => {
        this.notifierSettings = settings;
      },
      error: (error) => {
        console.error('Error loading notifier settings:', error);
      }
    });
  }

  loadDailyReport(): void {
    this.notifierService.getDailyReport().subscribe({
      next: (report) => {
        this.dailyReport = report;
      },
      error: (error) => {
        console.error('Error loading daily report:', error);
      }
    });
  }

  toggleNotifier(notifier: NotifierSetting): void {
    this.isUpdating = true;
    this.updateMessage = '';
    
    const newState = !notifier.isEnabled;
    
    this.notifierService.updateNotifierSetting(notifier.notifierName, newState).subscribe({
      next: () => {
        notifier.isEnabled = newState;
        notifier.lastUpdated = new Date();
        this.updateMessage = `${notifier.notifierName} notifications ${newState ? 'enabled' : 'disabled'} successfully`;
        this.updateSuccess = true;
        this.isUpdating = false;
        
        setTimeout(() => {this.updateMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating notifier:', error);
        this.updateMessage = `Failed to update ${notifier.notifierName} notifications`;
        this.updateSuccess = false;
        this.isUpdating = false;
        
        setTimeout(() => {
          this.updateMessage = '';
        }, 5000);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  runDailyReportNow(): void {
  this.isRunningDailyReport = true;
  this.reportTriggerMessage = '';
  
  this.notifierService.triggerDailyReport().subscribe({
    next: () => {
      this.reportTriggerMessage = 'Daily report triggered successfully!';
      this.reportTriggerSuccess = true;
      this.isRunningDailyReport = false;
      
      setTimeout(() => {
        this.reportTriggerMessage = '';
      }, 4000);
    },
  error: (error: any) => {
      console.error('Error triggering daily report:', error);
      this.reportTriggerMessage = 'Failed to trigger daily report. Please try again.';
      this.reportTriggerSuccess = false;
      this.isRunningDailyReport = false;
      
      setTimeout(() => {
        this.reportTriggerMessage = '';
      }, 5000);
    }
  });
}

runWeeklyReportNow(): void {
  this.isRunningWeeklyReport = true;
  this.reportTriggerMessage = '';
  
  this.notifierService.triggerWeeklyReport().subscribe({
    next: () => {
      this.reportTriggerMessage = 'Weekly report triggered successfully!';
      this.reportTriggerSuccess = true;
      this.isRunningWeeklyReport = false;
      
      setTimeout(() => {
        this.reportTriggerMessage = '';
      }, 4000);
    },
  error: (error: any) => {
      console.error('Error triggering weekly report:', error);
      this.reportTriggerMessage = 'Failed to trigger weekly report. Please try again.';
      this.reportTriggerSuccess = false;
      this.isRunningWeeklyReport = false;
      
      setTimeout(() => {
        this.reportTriggerMessage = '';
      }, 5000);
    }
  });
}
}