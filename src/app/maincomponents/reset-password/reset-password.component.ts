import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  
  passwordForm!: FormGroup;
  params:any

  constructor(private activatedRoute: ActivatedRoute, private users:UsersService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      'password': new FormControl(null, [Validators.required]),
      'password2': new FormControl(null, [Validators.required]),
    })

    this.activatedRoute.params.subscribe(params => {
      this.params = params
      localStorage.setItem('access-token', this.params.token);
    });
  }

  openSnack(message:string){
    this.snackBar.open(message);
  }

  click_sub(){
    if (this.passwordForm.value.password === this.passwordForm.value.password2){
      this.users.resetpasssword(this.passwordForm.value, this.params.id)
        .subscribe(res=>{
        })
    }else{
      this.openSnack("Las contraseñas no son iguales, vuelve a escribirlas")
    }
    this.passwordForm.reset()
  }

}
