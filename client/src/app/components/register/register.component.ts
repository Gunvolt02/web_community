import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // importo le funzioni di validazione e di creazione per le form

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // per l'esportazione (utilizzati nella parte di html)
  form: FormGroup;

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
    console.log(this.form);
  }

  // invocata ogni volta che questo componente viene caricato
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.createForm();
   }

  ngOnInit(): void {
  }

}
