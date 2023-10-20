import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { SignUpModel } from '../models/sign-up.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private API_URL = environment.apiUrl;

  public constructor(private http: HttpClient) {}

  public signUp(signUpData: SignUpModel): Observable<SignUpModel | boolean> {
    return this.http
      .post<SignUpModel>(`${this.API_URL}users`, signUpData)
      .pipe(catchError(() => of(false)));
  }

  /**
   * checkEmailInUse is used to imitate backend response
   * which states that the mock email 'inuse@example.com' is already in use
   */
  public checkEmailInUse(email: string): Observable<boolean> {
    return of(email === 'inuse@example.com').pipe(delay(500));
  }
}
