import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  authState: any = null;
  userFirebase;

  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.user = firebaseAuth.authState;


  }

  /**/

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
  
  
    
  
    /**/

  signup(userName: string, email: string, password: string, onError: (string) => void) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateUserData(userName);
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
}