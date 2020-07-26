export type UrgencyType = 'low' | 'medium' | 'high';

export class CalendarEvent {
  start: number | string;
  end: number | string;
  title: string;
  urgency: UrgencyType;
  date: string;
  constructor(
    start: number | string,
    end: number | string,
    title: string,
    urgency: UrgencyType,
    date: string
  ) {
    this.start = start;
    this.end = end;
    this.title = title;
    this.urgency = urgency;
    this.date = date;
  }
}
