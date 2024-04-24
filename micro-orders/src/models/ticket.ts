import mongoose, { Model } from "mongoose";
import { OrderModel } from "./order";
import { EOrderStatus } from "@xlegoleg/ticketing-common";

export interface ITicket {
  title: string;
  price: number;
  isReserved: () => Promise<boolean>;
}

export interface ITicketDoc extends mongoose.Document, ITicket {}

interface ITicketModel extends Model<ITicket> {
  build: (model: Omit<ITicket, 'isReserved'>) => ITicketDoc
};

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
}, { 
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

ticketSchema.statics.build = (attrs: ITicket) => {
  return new TicketModel(attrs);
};
ticketSchema.methods.isReserved = async function() {
  const existingOrder = await OrderModel.findOne({ 
    ticket: this,
    status: {
      $in: [EOrderStatus.Created, EOrderStatus.Complete, EOrderStatus.AwaitingPayment]
    }
  });

  return !!existingOrder;
}

const TicketModel = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);

export { TicketModel };