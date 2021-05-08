import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  storeData;
  username;
  email;
  nome;
  cognome;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.storeData = profile;
      this.username = this.storeData.user.username;
      this.email = this.storeData.user.email;
      this.nome = this.storeData.user.nome;
      this.cognome = this.storeData.user.cognome;
    });
  }

}
