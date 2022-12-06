import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { collection } from '@firebase/firestore';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    trainerName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    initialPokemon: new FormControl(''),
  });

  intialAvailablePokemons: any[] = [
    { name: 'Bulbasaur', value: 'bulbasaur' },
    { name: 'Charmander', value: 'charmander' },
    { name: 'Squirtle', value: 'squirtle' },
    { name: 'Pikachu', value: 'pikachu' },
  ];

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onSubmit() {
    const { trainerName, email, password, initialPokemon } =
      this.signupForm.value;

    try {
      const user = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      const collection = this.db.collection('trainers');

      collection.doc(user.user?.uid).set({
        name: trainerName,
        initialPokemon,
      });

      this.router.navigate(['']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}
