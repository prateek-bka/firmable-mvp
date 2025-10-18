import mongoose, { model, Schema } from "mongoose";
import type { AbnRecord } from "../types/abnRecordType.js";
import mongoosePaginate from "mongoose-paginate-v2";
import type { PaginateModel } from "mongoose-paginate-v2"; // plugin

export interface AbnRecordDocument extends mongoose.Document, AbnRecord {
  _id: string;
}

const abnRecordSchema = new Schema<AbnRecordDocument>(
  {
    abn: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String, // ACT (Active) or CAN (Cancelled)
    },
    statusFromDate: {
      type: Date,
    },
    entityType: {
      code: String, // PUB, PRV, etc.
      text: String, // Australian Public Company, etc.
    },
    mainName: {
      type: String,
      index: true,
    },
    businessAddress: {
      state: String,
      postcode: String,
    },
    gstStatus: {
      type: String, // ACT, CAN, NON
    },
    gstStatusFromDate: {
      type: Date,
    },
    tradingNames: [String],
    businessNames: [String],
    otherNames: [String],
    recordLastUpdated: {
      type: Date,
    },
    replaced: {
      type: String, // Y or N
    },
  },
  {
    timestamps: true,
  },
);

abnRecordSchema.index({ mainName: "text" });
abnRecordSchema.index({ status: 1 });
abnRecordSchema.index({ "businessAddress.state": 1 });
abnRecordSchema.index({ "businessAddress.postcode": 1 });
abnRecordSchema.index({ "entityType.code": 1 });
abnRecordSchema.index({ gstStatus: 1 });
abnRecordSchema.index({ tradingNames: 1 });
abnRecordSchema.index({ businessNames: 1 });
abnRecordSchema.index({ otherNames: 1 });

// Pagination
abnRecordSchema.plugin(mongoosePaginate);

export const abnModel = model<AbnRecordDocument, PaginateModel>(
  "AbnRecord",
  abnRecordSchema,
);
