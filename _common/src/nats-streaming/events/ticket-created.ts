import { TicketsSubjects } from "../subjects/tickets";

export interface TicketCreatedEvent {
  subject: TicketsSubjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
