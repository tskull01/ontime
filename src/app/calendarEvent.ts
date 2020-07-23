export type UrgencyType = 'low' | 'medium' | 'high';

export class CalendarEvent {
  start: number;
  end: number;
  title: string;
  uregncy: UrgencyType;
  constructor(start: number, end: number, title: string, urgency: UrgencyType) {
    this.start = start;
    this.end = end;
    this.title = title;
    this.uregncy = urgency;
  }
}
