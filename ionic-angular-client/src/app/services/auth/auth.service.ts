import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AuthReponse } from 'src/app/shared/models/authResponse.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private path = `${environment.apiUrl}/auth`;
  public isLoggedIn: boolean = false;
  public jwt: string = null;

  public authStateSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.authStateSubject = new BehaviorSubject(false);
    this.authStateSubject.subscribe(state => {
      this.isLoggedIn = state;
    })
  }

  loginWithGoogle(accessToken: string, idToken: string): Observable<AuthReponse>{
    return this.http.post(`${this.path}/createGoogle`, {
      accessToken,
      idToken
    }).pipe(map(resp => {
      const tmp = (new AuthReponse()).deserialize(resp);
      if(tmp && tmp.token){
        this.jwt = tmp.token;
        this.authStateSubject.next(true);
      }
      return tmp;
    }));
  }

  logout(){
    this.jwt = null;
    this.authStateSubject.next(false);
  }
}
