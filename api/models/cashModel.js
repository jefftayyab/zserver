import { model, Schema, ObjectId } from "mongoose";

const InvestmentSchema = new Schema(
  {
    investedBy: {
      type: ObjectId,
      ref: "User",
    },
    investedAmount: {
      type: Number,
      default: "",
    },
    totalAmount: {
      type: Number,
      default: "",
    },
    accountId: {
      type: String,
      default: "",
    },
    transactionId: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    Reason: {
      type: String,
      default: "",
    },
    picture: {},
    RequestedDate: {
      type: String,
      default: "",
    },
    RequestedTime: {
      type: String,
      default: "",
    },
    ApproveDate: {
      type: String,
      default: "",
    },
    ApproveTime: {
      type: String,
      default: "",
    },
    Status: {
      type: String,
      default: "pending",
      enum: ["pending", "Approve", "Reject"],
    },
    checkCode: {
      type: String,
      default: "",
    },
    // date: { type: Date, default: new Date().toLocaleTimeString },
  },
  { timestamps: true }
);

const Investment = model("Investment", InvestmentSchema);
export default Investment;
