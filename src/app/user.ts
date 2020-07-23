import { CalendarEvent } from './calendarEvent';

export class User {
  email: string;
  password: string;
  events: CalendarEvent[];
  constructor(email: string, password: string, events: CalendarEvent[]) {
    this.email = email;
    this.password = password;
    this.events = events;
  }
}
