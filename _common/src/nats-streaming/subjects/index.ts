export * from './tickets';
export * from './order';

import { TicketsSubjects } from "./tickets";
import { OrdersSubjects } from './order';

export type Subjects = TicketsSubjects | OrdersSubjects;