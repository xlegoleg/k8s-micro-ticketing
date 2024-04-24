import mongoose, { Schema, Model, Document, model } from "mongoose";
import { EOrderStatus } from "@xlegoleg/ticketing-common";
import { ITicketDoc } from "./ticket";

export interface IOrder {
  userId: string;
  status: EOrderStatus;
  expiresAt: Date;
  ticket: ITicketDoc;
};

interface IOrderDoc extends mongoose.Document, IOrder {}

interface IOrderModel extends Model<IOrder> {
  build: (model: IOrder) => IOrderDoc
};

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(EOrderStatus),
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

orderSchema.statics.build = (model: IOrder) => {
  return new OrderModel(model)
};

orderSchema.pre('save', function(done) {
  done();
});

export const OrderModel = model<Document<IOrder>, IOrderModel>('Order', orderSchema);