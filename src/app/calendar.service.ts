import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarEvent } from './calendarEvent';
import { User } from './user';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  //user events straight to calender
  userEvents: BehaviorSubject<CalendarEvent[]> = new BehaviorSubject<
    CalendarEvent[]
  >([]);
  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(
    new User('', '', [])
  );
  response: Observable<string>;
  constructor(private http: HttpClient) {}
  setCurrentUser(user: User) {}
  getUserEvents() {}
  updateUserEvents() {
    //make a copy in the event and then send the result here
    //probably firebase node function to update events
  }
  checkForUser(username, password) {
    this.http
      .post('/.netlify/functions/read', {
        body: JSON.stringify({ username: username, password: password }),
      })
      .subscribe((answer: Response) => {
        console.log(answer);
        if (answer === null) {
          //Suggest creating first event and a walk through visually
          console.log('response null');
        } else if (answer.status === 200) {
          // Login successful
        } else if (answer.status === 201) {
          //Created user
        } else if (answer.status === 202) {
          // Incorrect Password
        } else if (answer.status === 400) {
          //Errored out
        }
      });
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
