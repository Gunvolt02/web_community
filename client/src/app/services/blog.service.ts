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
    this.header = new HttpHeaders();
    this.header.append('Content-Type','application/json');
    this.header.append('Authorization', this.authService.authToken);
    console.log('blog service header token:  ' + this.authService.authToken);
  }

  newBlog(blog) {
    this.createAuthenticationHeaders();
    return this.httpClient.post(this.domain + 'blogs/newBlog', blog, {headers: this.header});
  }

  getAllBlogs() {
    this.createAuthenticationHeaders();
    return this.httpClient.post(this.domain + 'blogs/allBlogs', {headers: this.header});
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) { }

}
