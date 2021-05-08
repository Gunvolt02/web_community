import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // importo le funzioni di validazione e di creazione per le form
import { AuthService } from '../../services/auth.service'; // importo il servizio di autenticazione da me creato
import { BlogService } from '../../services/blog.service'; // importo il servizio di autenticazione da me creato
import { Router } from '@angular/router'; // modulo router per il redirecting

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost = false; // controlla se sta venendo creato un nuovo post
  loading = false; // controlla se è in corso il caricamento
  form;
  processing = false; // controlla se è in corso l'invio della form
  username; // contiene il nome utente
  storeData;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private blogService: BlogService
  ) {
    this.createNewBlogForm();
  }

  // funzione che crea la form
  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(80),
        Validators.minLength(5),
        this.validTitleChecker
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(5000),
        Validators.minLength(10)
      ])]
    });
  }

  enableFormNewBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  disableFormNewBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  validTitleChecker(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 _]*$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validTitleChecker': true };
    }
  }

  // funzione che indica che c'è un nuovo post
  newBlogForm() {
    this.newPost = true;
  }

  // funzione che ricarica per controllare se ci sono nuovi post
  refreshBlog() {
    this.loading = true;
    setTimeout(() => { // timeout di 4s per evitare di congestionare la rete con richieste continue
      this.loading = false;
    }, 4000);
  }

  newComment() {

  }


  onBlogSubmit() {
    this.processing = true;
    this.disableFormNewBlogForm();

    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      author: this.username
    };

    this.blogService.newBlog(blog).subscribe(data => {
      this.storeData = data;
      if (!this.storeData.success) {
        this.messageClass = 'alert alert-danger';
        this.message = this.storeData.message;
        this.processing = false;
        this.enableFormNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = this.storeData.message;
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = 'Recensione postata con successo';
          this.form.reset();
          this.enableFormNewBlogForm();
        }, 2000);
      }
    });

    console.log(blog.author);

  }

  goBack() {
    window.location.reload();
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(profile => {
      this.storeData = profile;
      this.username = this.storeData.user.username;
    });
  }

}
