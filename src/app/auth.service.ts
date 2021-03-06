import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  authState: any = null;
  userFirebase;

  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.user = firebaseAuth.authState;


  }


  loggedIn = false;

  isAuthenticated() {
    const promise = new Promise(
      (resolve, reject) => {
        setTimeout(() => {
          resolve(this.loggedIn)
        }, 800);

      }
    );
    return promise;
  }

  signup(displayName: string, email: string, password: string, onError: (string) => void) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateUserData(displayName);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
        onError(err.code);
        console.log(err);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.loggedIn = true;
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });

  }

  logout() {
    this.firebaseAuth.auth.signOut();
    this.loggedIn = false;
  //  this.disconnectPlayer(this.currentUserId);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);

  }

  private socialSignIn(provider) {
    return this.firebaseAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user;
        this.updateUserData(this.authState.displayName);
        this.loggedIn = true;
        this.addInRoom(this.currentUserId);
      //  this.disconnectPlayer(this.currentUserId)
      })
      .catch(error => console.log(error));
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  private updateUserData(userName: string): void {
    //let path = `users/${this.currentUserId}`;
    let path = "users/" + this.currentUserId;
    let data = {
      email: this.authState.email,
      name: userName,
      online: true,
    }
    this.db.object(path)
      .update(data)
      .catch(error => console.log(error));

    this.db.object(path)
      .valueChanges()
      .subscribe((toto) => {
        console.log(toto);
      });
  }

  //room pour stocker player//
  private addInRoom(userId): void {
    if (!this.loggedIn) {
      return;
    }
    let numPlayer = Math.floor(Math.random() * 2) + 1;
    console.log("resultat du math random :"+numPlayer)
    let path = numPlayer == 1 ? "room/players/player1" : "room/players/player2";
    this.db.object(path).set(this.currentUserId);
  }
  
  //verifier la presence du joueur 1 ou joueur 2
 
  private disconnectPlayer(currentUserId: string) {
    if (this.loggedIn == false) {
      this.db.object("room/players/player1").valueChanges().take(1).subscribe((player) => {
        console.log(player);
        if (player && player[currentUserId]) {
          console.log("je suis le joueur 1")
          this.db.object("room/players/player1").remove();
        }
      });
      this.db.object("room/players/player2").valueChanges().take(1).subscribe((player) => {
        console.log(player);
        if (player && player[currentUserId]) {
          console.log("je suis le joueur 2")
          this.db.object("room/players/player2").remove();

        }
      });
    }


  }
}
