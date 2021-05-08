import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  header;
  domain = this.authService.domain;

  // funzione per la creazione degli headers da utilizzare con i token ogni volta che c'è un'autorizzazione
  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.authToken
    });
    console.log(this.header);
  }

  newBlog(blog) {
    this.createAuthenticationHeaders();
    return this.httpClient.post(this.domain + 'blogs/newBlog', blog);
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) { }

}
