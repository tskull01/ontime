import { Component, OnInit, ViewChild } from '@angular/core';
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
  calendarApi: any;
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
    if (this.firstRender) {
      this.calendarApi = this.calender.getApi();
      this.calendarApi.setOption('eventClick', (e) => this.handleEventClick(e));
      this.calendarApi.setOption('dateClick', (e) => this.handleDateClick(e));
      this.firstRender = !this.firstRender;
      this.eventUpdater();
      this.calendarApi.resumeRendering();
    } else {
      this.calendarApi.resumeRendering();
    }
  }
  handleDateClick(e: DateClickArg) {
    //User clicked on a date
    let dateEvents = e.view.calendar.getEvents();
    this.calendarService.selectedDate.next(e.date);
    this.selectedDate = e.date;
    this.dialog.open(EventDialogComponent);
  }

  handleEventClick(arg: EventClickArg) {
    //user selected an event
    this.calendarService.selectedDate.next(arg.event.start);
    let dialogRef = this.dialog.open(EditEventComponent, {
      data: { event: arg.event.title },
    });
    let sub = this.calendarService.deleteEvent.subscribe((bool) => {
      //User selected event edit option
      if (bool) {
        //Just a delete
        let index = this.calendarEvents.findIndex(
          (value) => value.title === arg.event.title
        );
        let arrayCopy = this.calendarEvents;
        arrayCopy.splice(index, 1);
        this.calendarService.userEvents.next(arrayCopy);
        this.calendarService.updateUserEvents(false);
        sub.unsubscribe();
      } else {
        //Delete and add new event
        let index = this.calendarEvents.findIndex(
          (value) => value.title === arg.event.title
        );
        let arrayCopy = this.calendarEvents;
        arrayCopy.splice(index, 1);
        this.calendarService.userEvents.next(arrayCopy);
        this.calendarService.updateUserEvents(true);
        sub.unsubscribe();
      }
    });
  }
  eventUpdater() {
    this.calender.options;
    let calendarApi = this.calender.getApi();
    this.calendarService.userEvents.subscribe((events: CalendarEvent[]) => {
      this.calendarEvents = events;
      let flattenedEvents = [].concat.apply([], this.calendarEvents);
      calendarApi.removeAllEvents();
      flattenedEvents.map((event: CalendarEvent) => {
        calendarApi.addEvent({
          title: event.title,
          start: event.start,
          end: event.end,
          backgroundColor:
            event.urgency === 'low'
              ? 'blue'
              : event.urgency === 'high'
              ? 'red'
              : 'orange',
        });
      });
      calendarApi.render();
    });
  }
}
