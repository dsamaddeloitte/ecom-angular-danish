import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';



 
 


interface UserDetail {
  useremail: string;
  password: string;
}
interface UserError {
  errUseremail : string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ HttpClientModule,CommonModule, FormsModule],
  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  ngOnInit(): void {
    this.fetchData();
  }

  http = inject(HttpClient);
  router = inject(Router)
  authService = inject(AuthService)

  fetchData() {
    this.http
      .get<UserDetail>('http://localhost:3000/users')
      .subscribe((data: UserDetail) => {
        this.userDetail = data;
      });
  }
  userObj: UserDetail = {
    useremail: '',
    password: ''
  };
 
  userDetail: UserDetail = {
    useremail: '',
    password: ''
  };

  userErr: UserError= {
    errUseremail : ''
  }
  
 
  loginUser() {
    const values = Object.values(this.userDetail);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    let user = '';


    if(this.userObj.useremail==='' || this.userObj.password === ''){
      alert("All fields are compulsory")
      return;
    }
    else if(emailRegex.test(this.userObj.useremail) === false){
          this.userErr.errUseremail = 'Incorrect email address'
          return;
    }

    values.forEach(value => {
      if(value.useremail===this.userObj.useremail && value.password === this.userObj.password){
        user = value.useremail;
        this.authService.login(this.userObj.useremail)
        localStorage.setItem("user",value.useremail);
        this.router.navigate(['']);
      }
    });
    if(user === ''){
      alert('Account not exist')
    }

  }
 
  isPassword: boolean = true;
 
  togglePassword() {
    this.isPassword = !this.isPassword;
  }
}