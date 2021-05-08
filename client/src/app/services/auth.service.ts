import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // importo tutti i componenti necessari per le richieste HTTP
import { Observable } from 'rxjs'; // estensione necessaria
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt'; // modulo per controllare se il token è scaduto

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  domain = "http://localhost:8080/";
  authToken;  // contiene il token dell'utente
  user; // informazioni utente
  header; // contine i parametri header della richiesta http

  constructor(
    private httpClient: HttpClient,
    private jwtHelperService: JwtHelperService
  ) { }

  // funzione per la creazione degli headers da utilizzare con i token ogni volta che c'è un'autorizzazione
  createAuthenticationHeaders() {
    this.loadToken();
    this.header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken
    });
    console.log(this.header);
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  // funzione per registrare gli utenti
  registerUser(user) {
    return this.httpClient.post(this.domain + 'authentication/register', user);
  }

  // chiama la funzione per controllare se la mail esiste già dalla route /authentication
  checkEmail(email) {
    return this.httpClient.post(this.domain + 'authentication/checkEmail/', email);
  }

  // chiama la funzione per controllare se lo username esiste già dalla route /authentication
  checkUsername(username) {
    return this.httpClient.post(this.domain + 'authentication/checkUsername/', username);
  }

  // funzione di login
  login(user) {
    return this.httpClient.post(this.domain + 'authentication/login', user);
  }

  // funzione di logout
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  // funzione per salvare il token dell'utente
  storeUserData(token, user) {
    localStorage.setItem('token', token); // setta il token nel localStorage del browser
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // funzione che ottiene le informazioni per il profilo (attraverso il token)
  getProfile() {
    this.createAuthenticationHeaders();
    console.log(this.header);
    return this.httpClient.get(this.domain + 'authentication/profile', {headers: this.header});
  }

  // funzione per controllare se l'utente è loggato
  loggedIn() {
    return this.jwtHelperService.isTokenExpired(this.authToken);
  }

}
