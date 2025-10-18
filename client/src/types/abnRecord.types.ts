export interface AbnRecord {
  _id: string;
  abn: string;
  status?: string;
  mainName?: string;
  entityType?: {
    code?: string;
    text?: string;
  };
  businessAddress?: {
    state?: string;
    postcode?: string;
  };
  gstStatus?: string;
  tradingNames?: string[];
  businessNames?: string[];
  recordLastUpdated?: string;
}

export interface FilterData {
  states: string[];
  statuses: string[];
  entityTypes: { code: string; text: string }[];
  gstStatuses: string[];
  sortOptions: { value: string; label: string; default?: boolean }[];
}

export type SortDirection = "asc" | "desc" | null;
export type SortColumn =
  | "abn"
  | "mainName"
  | "entityType"
  | "status"
  | "state"
  | "gstStatus"
  | "recordLastUpdated"
  | null;

export interface FetchParams {
  page: number;
  limit: number;
  sort: string;
  q?: string;
  status?: string;
  state?: string;
  entityType?: string;
  gst?: string;
}

