import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-config-user',
  templateUrl: './config-user.component.html',
  styleUrls: ['./config-user.component.scss']
})
export class ConfigUserComponent implements OnInit {

  userForm!: FormGroup;
  passwordForm!: FormGroup;
  userId:any = localStorage.getItem('user_id');
  currentuser:any
  isEdit = false
  editPwd = false
  subscription!: Subscription;

  constructor(private users:UsersService) { }

  ngOnInit(): void {

    this.userForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.minLength(2) ,Validators.maxLength(20)]),
      'email': new FormControl(null, [Validators.required,  Validators.pattern("^[^@]+@[^@]+\.[^@]+$")]),
      'password': new FormControl(null, [Validators.required]),
    });

    this.passwordForm = new FormGroup({
      'oldpwd': new FormControl(null, [Validators.required]),
      'newpwd': new FormControl(null, [Validators.required]),
      'repeatpwd': new FormControl(null, [Validators.required]),
    })
    this.getUser()
    this.subscription = this.users.refresh$.subscribe(()=>{
      this.getUser();
    })
    this.userForm.disable()
  }

  updateUser(){
    const object = {
      ...this.userForm.value,
      pwd: this.currentuser.password
    }
    this.users.updateUser(this.userId, object).subscribe(res =>{
      console.log(res)
    })
    this.enableForm('D')
  }

  changePassword(){
    if (this.passwordForm.value.newpwd === this.passwordForm.value.repeatpwd) {
      const object = {
        ...this.passwordForm.value,
        pwd: this.currentuser.password
      }
      this.users.updatepwd(this.userId, object).subscribe(res =>{
        console.log(res)
      })
      this.enableForm('P')
    }else{
      window.alert("passwords don't match");
    }
    this.passwordForm.reset()
  }

  getUser(){
    this.users.getUser(this.userId).subscribe(res =>{
      this.currentuser = res
      this.userForm.patchValue({
        'username': this.currentuser.username,
        'email': this.currentuser.email,
      })
    })
  }
  
  enableForm(letter:string){
    if (letter == 'E') {
      this.userForm.enable()
      this.isEdit = true
    } 
    
    if(letter == 'D') {
      this.userForm.disable()
      this.isEdit = false
      this.userForm.patchValue({
        'password': ''
      })
    }

    if(letter == 'P') {
      this.editPwd = !this.editPwd
    }
  }

}
