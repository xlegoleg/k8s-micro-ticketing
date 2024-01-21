import { Schema, Model, Document, model } from "mongoose";

export interface ITicket {
  title: string;
  price: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

interface ITicketModel extends Model<ITicket> {
  build: (model: ITicket) => ITicket & Document
};

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

ticketSchema.statics.build = (model: ITicket) => {
  return new TicketModel(model)
};

ticketSchema.pre('save', function(done) {
  done();
});

export const TicketModel = model<Document<ITicket>, ITicketModel>('Ticket', ticketSchema);