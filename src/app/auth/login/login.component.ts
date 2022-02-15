import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {EvertecBackendService} from "../../services/evertec-backend.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent{

  loginForm: FormGroup = this.fb.group({
    email: ['',
            [
              Validators.required,
              Validators.email
            ]
    ],
    password: ['',
              [
                Validators.required,
                Validators.min(8)
              ]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private evertecService: EvertecBackendService,
    private router: Router
               ) { }

  public login(){
    this.evertecService.login(this.loginForm.value)
      .subscribe(valid => {
        if(valid === true){
          this.router.navigateByUrl('/main/products')
        }else{
          Swal.fire('Error',valid!,'error');
        }
      });
  }

}
