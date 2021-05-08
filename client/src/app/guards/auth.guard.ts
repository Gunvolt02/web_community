import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  redirect;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // funzione che controlla se l'utente è autorizzato
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (!this.authService.loggedIn()) {
      return true; // utente loggato e quindi autorizzato
    } else {
      this.redirect = state.url;
      this.router.navigate(['/login']); // ritorna al login
      return false; // non autorizzato
    }
  }
}
