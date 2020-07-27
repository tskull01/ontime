import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarService } from '../calendar.service';
import { CalendarEvent } from '../calendarEvent';
import { Router, ActivatedRoute } from '@angular/router';

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
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute
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
    let returnObservable = this.calendarService.checkForUser(
      this.loginForm.value.username,
      this.loginForm.value.password
    );
    returnObservable.subscribe((answer) => {
      answer
        ? this.calendarService.userEvents.subscribe((events) => {
            this.calendarEvents = events;
            this.loggedIn = true;
            this.router.navigate(['../calendar'], { relativeTo: this.route });
          })
        : (this.loggedIn = false);
    });
  }
}
