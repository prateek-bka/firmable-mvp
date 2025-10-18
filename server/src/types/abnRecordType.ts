export interface AbnRecord {
  abn: string;
  status?: string;
  statusFromDate?: Date;
  entityType?: {
    code?: string;
    text?: string;
  };
  mainName?: string;
  businessAddress?: {
    state?: string;
    postcode?: string;
  };
  gstStatus?: string;
  gstStatusFromDate?: Date;
  tradingNames?: string[];
  businessNames?: string[];
  otherNames?: string[];
  recordLastUpdated?: Date;
  replaced?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
