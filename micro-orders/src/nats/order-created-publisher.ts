import { Publisher, OrderCreatedEvent, OrdersSubjects } from "@xlegoleg/ticketing-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: OrdersSubjects.OrderCreated = OrdersSubjects.OrderCreated;
}