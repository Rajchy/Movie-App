import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private _loginUrl = 'https://demo.credy.in/api/v1/usermodule/login/';

  constructor(private http: HttpClient, private _router: Router) {}

  loginUser(user: {}) {
    return this.http.post<any>(this._loginUrl, user);
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/events']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }
  getallmovies() {
    return this.http.get('https://demo.credy.in/api/v1/maya/movies/');
  }
}

