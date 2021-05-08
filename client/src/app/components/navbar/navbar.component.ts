import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages'; // modulo per mostrare messaggi

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) { }

  // funzione da chimare quando si fa il logout
  onLogoutClick() {
    this.authService.logout();
    this.flashMessagesService.show('Logout eseguito', {cssClass: 'alert-info'}); // mostro questo avviso quando faccio il logout
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
  }

}
