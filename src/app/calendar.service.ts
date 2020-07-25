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
        console.log(answer);
        if (answer.events) {
          if (answer.events.length === 0) {
            //Suggest creating first event and a walk through visually
            console.log('No events created for user');
            this.currentUser.next(new User(answer.ref['@ref'].id, []));
            returnObservable.next(true);
          } else if (answer.events.length >= 1) {
            // Login successful and events exist
            console.log('login successful' + answer.ref['@ref'].id);
            this.userEvents.next([...answer.events]);
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
          }
        }
      });
    return returnObservable;
  }
  addUserEvent(currentUser, event: CalendarEvent) {
    //Search user push new event into events array
    //update calender
    this.http.post('/.netlify/functions/update', {
      body: JSON.stringify({
        title: event.title,
        start: event.start,
        end: event.end,
        urgency: event.uregncy,
        currentUser: currentUser.username,
      }),
    });
  }
}
