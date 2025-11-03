export interface NotifierSetting {
  id: number;
  notifierName: string;
  isEnabled: boolean;
  lastUpdated: Date;
  updatedBy?: string;
}

export interface DailyReport {
  date: string;
  totalTrades: number;
  itmCount: number;
  otmCount: number;
  winRate: number;
}