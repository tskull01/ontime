import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CalendarService } from '../calendar.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  //Login into user account fetched from fauna or switch to sign up and send new login to fauna
  //uses snackbars to communicate
  login: boolean = true;
  formGroup: FormGroup;
  constructor(private calenderService: CalendarService) {}
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }
  toggleLogin() {
    this.login = !this.login;
  }
  onSubmit(formGroup) {
    console.log(formGroup);
    this.calenderService.checkForUser(
      this.formGroup.controls.username,
      this.formGroup.controls.password
    );
  }
}
