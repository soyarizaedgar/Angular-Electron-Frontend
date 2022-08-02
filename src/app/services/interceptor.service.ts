import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private router: Router, private snackBar: MatSnackBar) { }

  openSnack(message:string){
    this.snackBar.open(message);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const authorizedReq =  req.clone({
      setHeaders:{
        'access-token': String(localStorage.getItem('access-token') || ''),
        'user_id': String(localStorage.getItem('user_id') || ''),
      }
    });

    return next.handle(authorizedReq).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 404 || err.status === 401) {
          this.router.navigate(['signin']);
          this.openSnack("Your email or password is incorrect, try it again")
        }

        return throwError( err );
      }));
  }
}
