import { EOrderStatus } from "../../constants/order-status-enum";
import { OrdersSubjects } from "../subjects/order";

export interface OrderCreatedEvent {
  subject: OrdersSubjects.OrderCreated;
  data: {
    id: string;
    status: EOrderStatus,
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      title: string;
      price: number;
    }
  };
}
