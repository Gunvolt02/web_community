import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // importo le funzioni di validazione e di creazione per le form
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;
  storeData;
  url; // pagina da cui si è stati reindirizzati

  // funzione per la creazione della form
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // funzione per disabilitare la form
  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  // funzione per abilitare la form
  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };

    this.authService.login(user).subscribe(data => {
      this.storeData = data;
      if (!this.storeData.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.storeData.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.storeData.message;
        this.authService.storeUserData(this.storeData.token, this.storeData.user);
        setTimeout(() => { // timeout prima del redirecting
          if (this.url) {
            this.router.navigate([this.url]); // fa ritrornare alla pagina a cui non si aveva accesso
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 2000);
      }
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm();
   }

  ngOnInit(): void {
    if (this.authGuard.redirect) { // controlla se è stato reindirizzato
      this.messageClass = 'alert alert-danger';
      this.message = 'Effettua il login per accedere alla pagina';
      this.url = this.authGuard.redirect;
      this.authGuard.redirect = undefined; // per evitare un redirecting continuo dopo il login
    }
  }

}
