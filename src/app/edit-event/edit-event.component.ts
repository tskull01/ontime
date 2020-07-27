import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CalendarService } from '../calendar.service';
import { User } from '../user';
import { CalendarEvent } from '../calendarEvent';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
export interface DialogData {
  event: any;
}
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  formGroup: FormGroup;
  currentUser: User;
  events: CalendarEvent[];
  subs: Subscription[];
  constructor(
    private calendarService: CalendarService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.data.event;
    this.formGroup = new FormGroup({
      title: new FormControl(''),
      start: new FormControl(''),
      end: new FormControl(''),
      urgency: new FormControl('low'),
      date: new FormControl(),
    });
    let sub1 = this.calendarService.currentUser.subscribe(
      (user) => (this.currentUser = user)
    );
    let sub2 = this.calendarService.userEvents.subscribe((events) => {
      console.log('fetched events');
      this.events = events;
    });
    this.subs = [sub1, sub2];
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subs.forEach((sub) => sub.unsubscribe());
  }
  onSubmit(value) {
    //create event and snackbar edited event
    let newEvent = new CalendarEvent(
      value.start,
      value.end,
      value.title,
      value.urgency,
      this.calendarService.selectedDate.value.toDateString()
    );
    console.log('adding user');
    this.calendarService.deleteEvent.next(false);
    let sub3 = this.calendarService.eventEdited.subscribe((bool) => {
      bool
        ? this.calendarService.addUserEvent(
            this.currentUser,
            newEvent,
            this.events
          )
        : null;
      this.subs.push(sub3);
      this.subs.forEach((sub) => sub.unsubscribe());
    });
  }
  deleteEvent() {
    //deleting event
    this.calendarService.deleteEvent.next(true);
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
