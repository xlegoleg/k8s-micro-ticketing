import { TicketsSubjects } from '../subjects/tickets';

export interface TicketUpdatedEvent {
  subject: TicketsSubjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
