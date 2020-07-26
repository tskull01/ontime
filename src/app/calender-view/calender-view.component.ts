import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  FullCalendarComponent,
  CalendarOptions,
  EventClickArg,
  EventApi,
} from '@fullcalendar/angular';
import { DateClickArg } from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { CalendarService } from '../calendar.service';
import { CalendarEvent } from '../calendarEvent';
@Component({
  selector: 'app-calender-view',
  templateUrl: './calender-view.component.html',
  styleUrls: ['./calender-view.component.css'],
})
export class CalenderViewComponent implements OnInit {
  //Revieves the current user and the current events then passes the events to the calenders
  //event option
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
  };
  selectedDate: Date;
  firstRender: boolean = true;
  @Input('calendarEvents') calendarEvents: CalendarEvent[];
  @ViewChild('calendar') calender: FullCalendarComponent;
  constructor(
    public dialog: MatDialog,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.firstRender = true;
  }
  ngAfterViewInit(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.calender.options;
    let calendarApi = this.calender.getApi();
    this.calendarService.userEvents.subscribe((events: CalendarEvent[]) => {
      this.calendarEvents = events;
      events.map((event: CalendarEvent) => {
        console.log(event);
        console.log(calendarApi.getEvents());
        calendarApi.addEvent({
          title: event.title,
          start: event.start,
          end: event.end,
          backgroundColor: 'blue',
        });
      });
      calendarApi.addEvent({ start: '2020-02-02T09:09:00' });
      console.log(calendarApi.getEvents());
      calendarApi.render();
    });
    calendarApi.resumeRendering();

    if (this.firstRender) {
      console.log(`setting listeners`);
      calendarApi.setOption('eventClick', (e) => this.handleEventClick(e));
      calendarApi.setOption('dateClick', (e) => this.handleDateClick(e));
      this.firstRender = !this.firstRender;
    }
  }
  handleDateClick(e: DateClickArg) {
    let dateEvents = e.view.calendar.getEvents();
    console.log(e.date);
    this.calendarService.selectedDate.next(e.date);
    this.selectedDate = e.date;
    let dialogRef = this.dialog.open(EventDialogComponent);
    //create event and add to userEvents array on DB
  }

  handleEventClick(arg: EventClickArg) {}
}
