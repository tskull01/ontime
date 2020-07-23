import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  //Login into user account fetched from fauna or switch to sign up and send new login to fauna
  //uses snackbars to communicate
  constructor() {}

  ngOnInit(): void {}
}
