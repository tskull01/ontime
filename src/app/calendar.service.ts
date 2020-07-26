import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CalendarEvent } from './calendarEvent';
import { User } from './user';
import { HttpClient, HttpResponse } from '@angular/common/http';

interface UserResponse {
  ref: Object;
  events: CalendarEvent[];
}
type UserResponsePlus = UserResponse & Response;
@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  //user events straight to calender
  userEvents: BehaviorSubject<CalendarEvent[]> = new BehaviorSubject<
    CalendarEvent[]
  >([]);
  selectedDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(
    new User(0, [])
  );
  response: Observable<string>;
  loggedIn: boolean;
  constructor(private http: HttpClient) {}
  setCurrentUser(user: User) {}
  getUserEvents() {}
  updateUserEvents() {
    //make a copy in the event and then send the result here
    //probably firebase node function to update events
  }
  checkForUser(username, password) {
    let returnObservable: BehaviorSubject<boolean> = new BehaviorSubject<
      boolean
    >(false);
    let sub = this.http
      .post('/.netlify/functions/read', {
        body: JSON.stringify({ username: username, password: password }),
      })
      .subscribe((answer: UserResponsePlus) => {
        console.log(answer.events);
        if (answer.events) {
          console.log(answer.events.length);
          if (
            answer.events.length === 0 ||
            answer.events.length === undefined
          ) {
            //Suggest creating first event and a walk through visually
            console.log('No events created for user');
            this.currentUser.next(new User(answer.ref['@ref'].id, []));
            returnObservable.next(true);
          } else if (answer.events.length >= 1) {
            // Login successful and events exist
            console.log('login successful' + answer.ref['@ref'].id);
            console.log('SEtting first events ' + answer.events);
            this.userEvents.next(answer.events);
            this.currentUser.next(
              new User(answer.ref['@ref'].id, answer.events)
            );
            sub.unsubscribe();
            returnObservable.next(true);
          }
        } else {
          if (answer.status === 201) {
            //Created user
            console.log('created user');

            this.currentUser.next(
              new User(answer.ref['@ref'].id, answer.events)
            );
            returnObservable.next(true);
          } else if (answer.status === 202) {
            // Incorrect Password
            console.log('incorrect password');
            returnObservable.next(false);
            //display snackbar with wrong password
          } else if (answer.status === 400) {
            //Errored out
            console.log('Error occured');
          }
        }
      });
    return returnObservable;
  }
  addUserEvent(
    currentUser: User,
    event: CalendarEvent,
    previousEvents: CalendarEvent[]
  ) {
    //Search user push new event into events array
    //update calender
    let formattedEvent = this.formatEvents(event, this.selectedDate.value);
    previousEvents.push(formattedEvent);
    this.http
      .post('/.netlify/functions/update', {
        body: JSON.stringify({
          events: previousEvents,
          currentUser: currentUser.id,
        }),
      })
      .subscribe((response: Response) => {
        //Added Event
        console.log(response['data'].userEvents);
        this.userEvents.next(response['data'].userEvents);
      });
  }
  formatEvents(event: CalendarEvent, date: Date) {
    let formattedStart, formattedEnd;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    console.log(day + ' day ' + month + ' month ' + year + ' year ');
    if (month <= 9 && day <= 9) {
      formattedStart = `${year}-0${month}-0${day}T${event.start}:00`;
      formattedEnd = `${year}-0${month}-0${day}T${event.end}:00`;
    } else if (month <= 9 && day >= 10) {
      formattedStart = `${year}-0${month}-${day}T${event.start}:00`;
      formattedEnd = `${year}-0${month}-${day}T${event.end}:00`;
    } else if (day <= 9) {
      formattedStart = `${year}-${month}-0${day}T${event.start}:00`;
      formattedEnd = `${year}-${month}-0${day}T${event.end}:00`;
    } else {
      formattedStart = `${year}-${month}-${day}T${event.start}:00`;
      formattedEnd = `${year}-${month}-${day}T${event.end}:00`;
    }
    let formattedObject: CalendarEvent = new CalendarEvent(
      formattedStart,
      formattedEnd,
      event.title,
      event.urgency,
      event.date
    );
    console.log(formattedObject);
    return formattedObject;
  }
}
