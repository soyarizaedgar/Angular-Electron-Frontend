import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators} from '@angular/forms';
import { UsersService } from "../../services/users.service";
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgotpwdModalComponent } from '../forgotpwd-modal/forgotpwd-modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private users: UsersService, private router: Router, public modal: MatDialog) { }

  registerForm!: FormGroup;
  signinForm!: FormGroup;

  isRegister = false


  ngOnInit(): void {

    this.registerForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.minLength(2) ,Validators.maxLength(20)]),
      'email': new FormControl(null, [Validators.required,  Validators.pattern("^[^@]+@[^@]+\.[^@]+$")]),
      'password': new FormControl(null, [Validators.required]),
    });

    this.signinForm = new FormGroup({
      'email': new FormControl(null, [Validators.required,  Validators.pattern("^[^@]+@[^@]+\.[^@]+$")]),
      'password': new FormControl(null, [Validators.required]),
    });

    this.redirect()
  }

  click_reg() {
    this.users.signup(this.registerForm.value).subscribe(response =>{
      
    },(err) => {if (err.status === 500) {
      
    }});
    this.registerForm.reset();
    this.isRegister = true
  }

  click_sign() {
    this.users.signin(this.signinForm.value).subscribe(response =>{
      
    },(err) => {if (err.status === 500) {
      console.log(err)
    }});
    // this.signinForm.reset();
  }

  isRegisterToogle(value: boolean){
    this.isRegister = value
  }

  redirect(){
    if(this.users.isLogged()){
      this.router.navigateByUrl('/home');
    }else{
      this.router.navigateByUrl('/signin')
    }
  }

  forgotPwd(){
    this.modal.open(ForgotpwdModalComponent)
  }
}
