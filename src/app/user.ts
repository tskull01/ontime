import { CalendarEvent } from './calendarEvent';

export class User {
  id: number;
  events: CalendarEvent[];
  constructor(id: number, events: CalendarEvent[]) {
    this.id = id;
    this.events = events;
  }
}
