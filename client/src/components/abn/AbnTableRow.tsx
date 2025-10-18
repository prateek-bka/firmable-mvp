import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AbnRecord } from "@/types/abnRecord.types";
import { getStatusBadgeColor, formatDate } from "@/utils/abnRecord.utils";

interface AbnTableRowProps {
  record: AbnRecord;
}

export const AbnTableRow = ({ record }: AbnTableRowProps) => {
  return (
    <TableRow className="hover:bg-accent/50 transition-colors">
      <TableCell className="font-mono text-sm">{record.abn}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{record.mainName || "N/A"}</div>
          {record.tradingNames && record.tradingNames.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Trading as: {record.tradingNames[0]}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{record.entityType?.text || "N/A"}</span>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeColor(record.status)}>
          {record.status || "N/A"}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {record.businessAddress?.state || "N/A"}
      </TableCell>
      <TableCell>
        <Badge
          variant={record.gstStatus === "REGISTERED" ? "default" : "secondary"}
        >
          {record.gstStatus || "N/A"}
        </Badge>
      </TableCell>
      <TableCell className="text-sm">
        {formatDate(record.recordLastUpdated)}
      </TableCell>
    </TableRow>
  );
};
