import { Publisher, TicketUpdatedEvent, TicketsSubjects } from "@xlegoleg/ticketing-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: TicketsSubjects.TicketUpdated = TicketsSubjects.TicketUpdated;
}