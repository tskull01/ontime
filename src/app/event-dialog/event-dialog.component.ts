import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { DatePointApi } from '@fullcalendar/angular';
import { CalendarService } from '../calendar.service';
import { User } from '../user';
import {
  MatFormFieldModule,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { CalendarEvent } from '../calendarEvent';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css'],
})
export class EventDialogComponent implements OnInit {
  startSuffix: boolean = true;
  endSuffix: boolean = true;
  formGroup: FormGroup;
  urgencyValue: string;
  currentUser: User;
  events: CalendarEvent[];
  constructor(private calenderService: CalendarService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      title: new FormControl(''),
      start: new FormControl(''),
      end: new FormControl(''),
      urgency: new FormControl(this.urgencyValue),
      date: new FormControl(),
    });
    this.calenderService.currentUser.subscribe(
      (user) => (this.currentUser = user)
    );
    this.calenderService.userEvents.subscribe((events) => {
      this.events = events;
    });
  }

  toggleHalf(value) {
    switch (value) {
      case 'start':
        this.startSuffix = !this.startSuffix;
        break;
      case 'end':
        this.endSuffix = !this.endSuffix;
        break;
    }
  }
  onSubmit(value) {
    console.log(this.calenderService.selectedDate.value.getMonth());
    let newEvent = new CalendarEvent(
      value.start,
      value.end,
      value.title,
      value.urgency,
      this.calenderService.selectedDate.value.toDateString()
    );
    console.log(newEvent.date + '    NEW EVENT DATE');
    this.calenderService.addUserEvent(this.currentUser, newEvent, this.events);
  }
}
