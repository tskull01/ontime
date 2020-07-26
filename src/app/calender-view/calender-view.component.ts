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
import { Router } from '@angular/router';
import { EditEventComponent } from '../edit-event/edit-event.component';
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
  calendarEvents: CalendarEvent[];
  @ViewChild('calendar') calender: FullCalendarComponent;
  constructor(
    public dialog: MatDialog,
    private calendarService: CalendarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.firstRender = true;
    this.calendarService.selectedDate.subscribe((date) => console.log(date));
    this.calendarService.deleteUser.subscribe((answer) => console.log(answer));
  }
  ngAfterViewInit(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.calender.options;
    let calendarApi = this.calender.getApi();
    this.calendarService.userEvents.subscribe((events: CalendarEvent[]) => {
      console.log(events);
      this.calendarEvents = events;
      let flattenedEvents = [].concat.apply([], this.calendarEvents);
      console.log(flattenedEvents);
      calendarApi.removeAllEvents();
      flattenedEvents.map((event: CalendarEvent) => {
        calendarApi.addEvent({
          title: event.title,
          start: event.start,
          end: event.end,
          backgroundColor: 'blue',
        });
        console.log(calendarApi.getEvents());
      });
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
    this.dialog.open(EventDialogComponent);
    //create event and add to userEvents array on DB
  }

  handleEventClick(arg: EventClickArg) {
    console.log(arg.event.start + ' ARGS ');
    this.calendarService.selectedDate.next(arg.event.start);
    let dialogRef = this.dialog.open(EditEventComponent, {
      data: { event: arg.event.title },
    });
    this.calendarService.deleteUser.subscribe((bool) => {
      if (bool) {
        let index = this.calendarEvents.findIndex(
          (value) => value.title === arg.event.title
        );
        console.log(index + ' INDEX TO DELETE ');
        let arrayCopy = this.calendarEvents;
        console.log(arrayCopy + 'Array copy');
        arrayCopy.splice(index, 1);
        this.calendarService.userEvents.next(arrayCopy);
      }
    });
  }
}
