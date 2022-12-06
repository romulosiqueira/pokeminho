import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  ngOnInit(): void {}

  async onSubmit() {
    const { email, password } = this.loginForm.value;
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}
