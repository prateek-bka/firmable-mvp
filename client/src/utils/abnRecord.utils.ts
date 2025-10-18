import type { AbnRecord, SortColumn, SortDirection } from "@/types/abnRecord.types";

export const getStatusBadgeColor = (status?: string) => {
  if (!status) return "secondary";
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "default";
    case "CANCELLED":
      return "destructive";
    default:
      return "secondary";
  }
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const sortRecords = (
  records: AbnRecord[],
  column: SortColumn,
  direction: SortDirection
): AbnRecord[] => {
  if (!column || !direction) return records;

  return [...records].sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";

    switch (column) {
      case "abn":
        aVal = a.abn || "";
        bVal = b.abn || "";
        break;
      case "mainName":
        aVal = (a.mainName || "").toLowerCase();
        bVal = (b.mainName || "").toLowerCase();
        break;
      case "entityType":
        aVal = (a.entityType?.text || "").toLowerCase();
        bVal = (b.entityType?.text || "").toLowerCase();
        break;
      case "status":
        aVal = (a.status || "").toLowerCase();
        bVal = (b.status || "").toLowerCase();
        break;
      case "state":
        aVal = (a.businessAddress?.state || "").toLowerCase();
        bVal = (b.businessAddress?.state || "").toLowerCase();
        break;
      case "gstStatus":
        aVal = (a.gstStatus || "").toLowerCase();
        bVal = (b.gstStatus || "").toLowerCase();
        break;
      case "recordLastUpdated":
        aVal = new Date(a.recordLastUpdated || 0).getTime();
        bVal = new Date(b.recordLastUpdated || 0).getTime();
        break;
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

