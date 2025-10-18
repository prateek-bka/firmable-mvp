import moment from "moment";

// Parse date from format like "20180216" to Date object
export function parseDate(dateString: string): Date | null {
  if (!dateString || dateString.length !== 8) return null;
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  const dateStr = `${year}-${month}-${day}`;
  const parsedDate = moment(dateStr, "YYYY-MM-DD");
  return parsedDate.isValid() ? parsedDate.toDate() : null;
}
