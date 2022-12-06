import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedPokemon: any = null;

  pokemonList: any[] = [];

  search = '';

  trainer: any = {};

  favorites: any[] = [];

  trainerId: any = null;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore
  ) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.trainerId = user.uid;
        this.db
          .collection('trainers')
          .doc(user.uid)
          .get()
          .subscribe((doc: any) => {
            if (doc.exists) {
              this.trainer = doc.data();

              this.favorites = this.trainer.favorites;
              console.log(this.trainer);

              this.db
                .collection('trainers/' + user.uid + '/favorites')
                .valueChanges()
                .subscribe((doc: any) => {
                  this.favorites = doc;
                });
            }
          });
      }
    });
  }

  ngOnInit(): void {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((response) => response.json())
      .then((data) => {
        this.pokemonList = data.results;
      });
  }

  onSearch(event: any) {
    const pokemonName = event.target.value;

    if (!pokemonName || pokemonName.length < 3) {
      this.selectedPokemon = null;
      return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        this.selectedPokemon = data;
      })
      .catch((error) => {
        this.selectedPokemon = null;
      });
  }

  addToFavorites() {
    this.db
      .collection('trainers')
      .doc(this.trainerId)
      .collection('favorites')
      .doc(this.selectedPokemon.name)
      .set({
        name: this.selectedPokemon.name,
        image: this.selectedPokemon.sprites.front_default,
      });
  }

  isFavorite() {
    if (!this.selectedPokemon) {
      return false;
    }

    if (this.favorites == undefined) {
      return false;
    }
    const favorite = this.favorites.find(
      (favorite) => favorite.name === this.selectedPokemon.name
    );

    return favorite ? true : false;
  }

  removeFromFavorites() {
    this.db
      .collection('trainers')
      .doc(this.trainerId)
      .collection('favorites')
      .doc(this.selectedPokemon.name)
      .delete();
  }

  selectPokemon(pokemon: any) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        this.selectedPokemon = data;
      })
      .catch((error) => {
        this.selectedPokemon = null;
      });
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['auth']);
  }
}
