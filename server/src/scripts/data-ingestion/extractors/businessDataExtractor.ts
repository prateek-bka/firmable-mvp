import { parseDate } from "../utils/dateParser.js";

// Extract business data from ABR record
export function extractBusinessData(abr: any) {
  // Basic info
  const abnData = abr.ABN;
  const abn = abnData["#text"];
  const status = abnData["@_status"];
  const statusFromDate = parseDate(abnData["@_ABNStatusFromDate"]);

  // Entity type
  const entityType = abr.EntityType
    ? {
      code: abr.EntityType.EntityTypeInd,
      text: abr.EntityType.EntityTypeText,
    }
    : undefined;

  // Main business name
  const mainName = abr.MainEntity?.NonIndividualName?.NonIndividualNameText || "";

  // Business address
  const addressDetails = abr.MainEntity?.BusinessAddress?.AddressDetails;
  const businessAddress = addressDetails
    ? {
      state: addressDetails.State,
      postcode: addressDetails.Postcode,
    }
    : undefined;

  // GST info
  const gstData = abr.GST;
  const gstStatus = gstData ? gstData["@_status"] : undefined;
  const gstStatusFromDate = gstData ? parseDate(gstData["@_GSTStatusFromDate"]) : null;

  // Other names (trading names, business names, etc.)
  const tradingNames: string[] = [];
  const businessNames: string[] = [];
  const otherNames: string[] = [];

  if (abr.OtherEntity) {
    const entities = Array.isArray(abr.OtherEntity) ? abr.OtherEntity : [abr.OtherEntity];
    entities.forEach((entity: any) => {
      const name = entity.NonIndividualName?.NonIndividualNameText;
      const type = entity.NonIndividualName?.["@_type"];

      if (name) {
        if (type === "TRD") tradingNames.push(name);
        else if (type === "BN") businessNames.push(name);
        else otherNames.push(name);
      }
    });
  }

  // Record metadata
  const recordLastUpdated = parseDate(abr["@_recordLastUpdatedDate"]);
  const replaced = abr["@_replaced"];

  return {
    abn,
    status,
    statusFromDate,
    entityType,
    mainName,
    businessAddress,
    gstStatus,
    gstStatusFromDate,
    tradingNames,
    businessNames,
    otherNames,
    recordLastUpdated,
    replaced,
  };
}

