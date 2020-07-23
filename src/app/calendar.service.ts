import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarEvent } from './calendarEvent';
import { User } from './user';

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
  constructor() {}
  setCurrentUser(user: User) {}
  getUserEvents() {}
  updateUserEvents() {
    //make a copy in the event and then send the result here
    //probably firebase node function to update events
  }
  addUserEvent(currentUser, event) {}
}
