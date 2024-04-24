import { Publisher, OrderCancelledEvent, OrdersSubjects } from "@xlegoleg/ticketing-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: OrdersSubjects.OrderCancelled = OrdersSubjects.OrderCancelled;
}