import { OrdersSubjects } from "../subjects/order";

export interface OrderCancelledEvent {
  subject: OrdersSubjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
      price: number;
    }
  };
}
