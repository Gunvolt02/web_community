import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // importo le funzioni di validazione e di creazione per le form
import { AuthService } from '../../services/auth.service'; // importo il servizio di autenticazione da me creato
import { Router } from '@angular/router'; // modulo router per il redirecting

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // per l'esportazione (utilizzati nella parte di html)
  form: FormGroup;
  message;  // messaggio da mostrare
  messageClass; // classe bootstrap del messaggio
  dataRegister; // contiene la risposta data dalla route /authentication
  processing = false; // per evitare più invii simultanei
  emailValid; // esito controllo mail
  emailMessage; // messaggio da mostrare per la mail
  usernameValid; // esito controllo username
  usernameMessage; // messaggio da mostrare per lo username

  // funzione per la creazione della form
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([   // i nomi devono corrispondere a quelli indicati come parametri del formControlName
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.validateUsername
      ])],
      nome: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.validateName
      ])],
      cognome: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        this.validateName
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        this.validatePassword
      ])],
      confirm: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
    }, { validator: this.matchingPassword('password', 'confirm') });
  }

  // funzione per disabilitare la form
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['nome'].disable();
    this.form.controls['cognome'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  // funzione per abilitare la form
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['nome'].enable();
    this.form.controls['cognome'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  // funzione di validazione email che restituisce l'oggetto utilizzato come errore personalizzato per la pagina html
  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true };
    }
  }

  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9_]*$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true };
    }
  }

  validateName(controls) {
    const regExp = new RegExp(/^[a-zA-Z]*$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateName': true };
    }
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true };
    }
  }

  // funzione che controlla se le password coincidono
  matchingPassword(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return {'matchingPassword': true}
      }
    }
  }

  // funzione lanciata all'invio dei dati con l'evento (submit) di Angular
  onRegisterSubmit() {
    this.processing = true;
    this.disableForm(); // blocca la form mentre prova a registrare l'utente
    // crea l'utente da inserire nel db
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      nome: this.form.get('nome').value,
      cognome: this.form.get('cognome').value,
      password: this.form.get('password').value,
    }

    // usa il servizio che abbiamo creato per registrarlo
    this.authService.registerUser(user).subscribe(data => {
      this.dataRegister = data;
      if(!this.dataRegister.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.dataRegister.message; // mostra il messaggio che ha ricevuto (il json creato dalla route /authentication)
        this.processing = false;
        this.enableForm(); // riabilita la form per correggere le informazioni
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.dataRegister.message;
        setTimeout(() => { // timeout prima del redirecting
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
  }

  // funzione per controllare se la mail esiste (con la route /authentication) e mostrare i relativi messaggi
  checkEmail() {
    this.authService.checkEmail(this.form.get('email')).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.emailValid = false;
        this.emailMessage = this.dataRegister.message;
      } else {
        this.emailValid = true;
        this.emailMessage = this.dataRegister.message;
      }
    });
  }

  // funzione per controllare se lo username esiste (con la route /authentication) e mostrare i relativi messaggi
  checkUsername() {
    this.authService.checkUsername(this.form.get('username')).subscribe(data => {
      this.dataRegister = data;
      if (!this.dataRegister.success) {
        this.usernameValid = false;
        this.usernameMessage = this.dataRegister.message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = this.dataRegister.message;
      }
    });
  }

  // invocata ogni volta che questo componente viene caricato
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
   }

  ngOnInit(): void {
  }

}
