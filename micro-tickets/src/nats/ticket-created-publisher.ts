import { Publisher, TicketCreatedEvent, TicketsSubjects } from "@xlegoleg/ticketing-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketsSubjects.TicketCreated = TicketsSubjects.TicketCreated;
}