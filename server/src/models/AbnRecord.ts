import mongoose from "mongoose";

const abnRecordSchema = new mongoose.Schema(
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
  }
);

// Create indexes for faster search
abnRecordSchema.index({ mainName: "text" });
abnRecordSchema.index({ status: 1 });
abnRecordSchema.index({ "businessAddress.state": 1 });

export const AbnRecord = mongoose.model("AbnRecord", abnRecordSchema);

