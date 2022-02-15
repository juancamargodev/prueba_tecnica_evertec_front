import { Injectable } from '@angular/core';
import {CanActivate, CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {EvertecBackendService} from "../services/evertec-backend.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ValidateTokenGuard implements CanActivate, CanLoad {

  constructor(
    private evertecService: EvertecBackendService,
    private router: Router
  ){}

  canActivate(): Observable<boolean> | boolean {
    return this.evertecService.validateToken()
      .pipe(
        tap( valid => {
         if(!valid){
           this.router.navigateByUrl('');
         }
        })
      );
  }
  canLoad(): Observable<boolean> | boolean {
    return this.evertecService.validateToken()
      .pipe(
        tap( valid => {
          if(!valid){
            this.router.navigateByUrl('');
          }
        })
      );
  }
}
