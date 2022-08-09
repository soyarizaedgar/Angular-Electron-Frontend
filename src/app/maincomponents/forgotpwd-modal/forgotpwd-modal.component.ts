import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-forgotpwd-modal',
  templateUrl: './forgotpwd-modal.component.html',
  styleUrls: ['./forgotpwd-modal.component.scss']
})
export class ForgotpwdModalComponent implements OnInit {
  forgotForm!: FormGroup;
  constructor(private users: UsersService) { }

  ngOnInit(): void {
    this.forgotForm = new FormGroup({
      'email': new FormControl(null, [Validators.required,  Validators.pattern("^[^@]+@[^@]+\.[^@]+$")])
    });
  }

  click_sub(){
    const email = this.forgotForm.value
    this.users.forgotpassword(email).subscribe(res =>{
      console.log(res)
    })
  }

}
