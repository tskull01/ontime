import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  FullCalendarComponent,
  CalendarOptions,
  EventClickArg,
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
    let calendarApi = this.calender.getApi();
    this.calendarService.userEvents.subscribe((events: CalendarEvent[]) => {
      console.log(
        'adding events' + events.forEach((event) => console.log(event))
      );
      this.calendarEvents = events;
      this.calendarEvents.map((event) => calendarApi.addEvent(event));

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
    let dialogRef = this.dialog.open(EventDialogComponent);
    //create event and add to userEvents array on DB
  }
  handleEventClick(arg: EventClickArg) {}
}
