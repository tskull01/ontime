import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent } from './calendarEvent';
import { User } from './user';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  userEvents: BehaviorSubject<CalendarEvent[]> = new BehaviorSubject<
    CalendarEvent[]
  >([]);
  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(
    new User('', '', [])
  );
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
        username: username,
        password: password,
      })
      .subscribe((answer) => {
        console.log(answer);
      });
  }
  addUserEvent(currentUser, event) {}
}
