import { Component, OnInit, Input } from '@angular/core';
import { EventClickArg } from '@fullcalendar/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { CalendarService } from '../calendar.service';
import { User } from '../user';
import { CalendarEvent } from '../calendarEvent';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  @Input('data') catchingData: any;
  @Input('event') event: EventClickArg;
  formGroup: FormGroup;
  currentUser: User;
  events: CalendarEvent[];
  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      title: new FormControl(''),
      start: new FormControl(''),
      end: new FormControl(''),
      urgency: new FormControl('low'),
      date: new FormControl(),
    });
    this.calendarService.currentUser.subscribe(
      (user) => (this.currentUser = user)
    );
    this.calendarService.userEvents.subscribe(
      (events) => (this.events = events)
    );
  }
  onSubmit(value) {
    //create event and snackbar edited event
    this.calendarService.deleteUser.next(true);
    let newEvent = new CalendarEvent(
      value.start,
      value.end,
      value.title,
      value.urgency,
      this.calendarService.selectedDate.value.toDateString()
    );
    this.calendarService.addUserEvent(this.currentUser, newEvent, this.events);
  }
  deleteEvent() {
    //deleting user
    this.calendarService.deleteUser.next(true);
  }
}
