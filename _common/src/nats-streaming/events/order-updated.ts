import { EOrderStatus } from "../../constants/order-status-enum";
import { OrdersSubjects } from "../subjects/order";

export interface OrderUpdatedEvent {
  subject: OrdersSubjects.OrderUpdated;
  data: {
    id: string;
    status: EOrderStatus,
    userId: string;
    expiresAt: string;
  };
}
