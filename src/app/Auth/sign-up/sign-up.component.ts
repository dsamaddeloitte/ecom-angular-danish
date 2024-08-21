import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface UserDetail {
  useremail: string;
  password: string;
  confirmPassword: string;
}

interface UserError {
  errUseremail: string;
  errPassword: string;
  errConfirmPassword: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, HttpClientModule], // FormModule used to get value from form, by using [(ngModel)] we tak value from inputs.
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  userObj: UserDetail = {
    useremail: '',
    password: '',
    confirmPassword: '',
  };
  userErr: UserError = {
    errUseremail: '',
    errPassword: '',
    errConfirmPassword: '',
  };

  http = inject(HttpClient);
  router = inject(Router);

  registerUser() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (
      this.userObj.useremail === '' ||
      this.userObj.password === '' ||
      this.userObj.confirmPassword === ''
    ) {
      alert('All fields are compulsory');
      return;
    } else if (emailRegex.test(this.userObj.useremail) === false) {
      this.userErr.errUseremail = 'Incorrect email address';
      return;
    } else if (this.userObj.password.length < 5) {
      this.userErr.errPassword = 'Minimum 5 character required';
      return;
    } else if (this.userObj.confirmPassword !== this.userObj.password) {
      this.userErr.errConfirmPassword = 'Password not match';
      return;
    }

    if (this.userObj.password === this.userObj.confirmPassword) {
      this.http
        .post('http://localhost:3000/users', this.userObj)
        .pipe(
          catchError((error) => {
            console.log('Error: ' + error.message);
            return of(null);
          })
        )
        .subscribe((res) => {
          console.log(res);
          this.router.navigate(['login']);
        });
    }
  }
  isPassword: boolean = true;
  togglePassword() {
    this.isPassword = !this.isPassword;
  }
}
