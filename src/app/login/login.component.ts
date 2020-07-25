import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarService } from '../calendar.service';
import { CalendarEvent } from '../calendarEvent';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loggedIn: boolean = false;
  calendarEvents: CalendarEvent[];
  constructor(
    private formBuilder: FormBuilder,
    private calendarService: CalendarService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, Validators.required],
    });
    this.calendarService.userEvents.subscribe((events) => {
      this.calendarEvents = events;
    });
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value.username);
    let returnObservable = this.calendarService.checkForUser(
      this.loginForm.value.username,
      this.loginForm.value.password
    );
    returnObservable.subscribe((answer) => {
      answer
        ? this.calendarService.userEvents.subscribe((events) => {
            this.calendarEvents = events;
            this.loggedIn = true;
          })
        : (this.loggedIn = false);
    });
  }
}
