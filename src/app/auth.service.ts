import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  authState: any = null;

  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.user = firebaseAuth.authState;
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);

      });
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })

      .catch(err => {
        console.log('Something went wrong:', err.message);
        alert('Fail');
      });

  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
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
        this.authState = credential.user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }
  get authenticated(): boolean {
    return this.authState !== null;
  }
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  private updateUserData(): void {
    let path = ` users/${this.currentUserId}`;
    let data = {
      email: this.authState.email,
      name: this.authState.displayName
    }
    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }
}