import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IUser } from '../models/auth/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authErrorMessage$ = new BehaviorSubject<string>('');
  private authErrorMessageStore: { message: string } = {
    message: '',
  };
  readonly authErrorMessage = this.authErrorMessage$.asObservable();

  private authSuccessMessage$ = new BehaviorSubject<string>('');
  private authSuccessMessageStore: { message: string } = {
    message: '',
  };
  readonly authSuccessMessage = this.authSuccessMessage$.asObservable();

  private userLoggedIn$ = new BehaviorSubject<boolean>(false);
  private userLoggedInStore: { loggedIn: boolean } = {
    loggedIn: false,
  };
  readonly userLoggedIn = this.userLoggedIn$.asObservable();

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private storageService: StorageService
  ) {}

  setUserLoggedInStore(userLoggedIn: boolean): void {
    this.userLoggedInStore.loggedIn = userLoggedIn;
    this.userLoggedIn$.next(userLoggedIn);
  }

  setAuthSuccessMessageStore(message: string): void {
    this.authSuccessMessageStore.message = message;
    this.authSuccessMessage$.next(message);
  }

  setAuthErrorMessageStore(message: string): void {
    this.authErrorMessageStore.message = message;
    this.authSuccessMessage$.next(message);
  }

  setErrorMessages(err: string) {
    if (err.includes('(auth/email-already-in-use)')) {
      this.setAuthErrorMessageStore('Email already exists.');
    } else if (err.includes('(auth/wrong-password)')) {
      this.setAuthErrorMessageStore('Wrong email/password.');
    } else if (err.includes('(auth/user-not-found)')) {
      this.setAuthSuccessMessageStore('User not found.');
    } else if (err.includes('(auth/wrong-password)')) {
      this.setAuthErrorMessageStore('Wrong email/password.');
    }
  }

  async setLoggedIn() {
    const token = this.storageService.getToken();
    if (token) {
      this.setUserLoggedInStore(true);
    } else {
      this.setUserLoggedInStore(false);
    }
  }

  async login(email: string, password: string) {
    this.setAuthErrorMessageStore('');
    this.setAuthSuccessMessageStore('');
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      const token = await result.user?.getIdToken();

      if (result.user && token) {
        this.storageService.saveUser(result.user);
        this.storageService.saveToken(token);
        this.setUserLoggedInStore(true);
        this.router.navigate(['/todos']);
      }
    } catch (error) {
      const err = String(error);
      this.setErrorMessages(err);
      this.setUserLoggedInStore(false);
    }
  }

  async register(user: IUser) {
    this.setAuthErrorMessageStore('');
    this.setAuthSuccessMessageStore('');
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
      const token = await result.user?.getIdToken();

      if (result.user && token) {
        this.storageService.saveUser(result.user);
        this.storageService.saveToken(token);
        this.router.navigate(['/todos']);
      }
    } catch (error) {
      const err = String(error);
      this.setErrorMessages(err);
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.storageService.signOut();
      this.setUserLoggedInStore(false);
      this.setAuthErrorMessageStore('');
      this.setAuthSuccessMessageStore('');
      this.router.navigate(['/auth/login']);
    } catch (error) {
      const err = String(error);
    }
  }

  public get isLoggedIn(): boolean {
    const token = this.storageService.getToken();
    if (token) {
      this.setUserLoggedInStore(true);
      return true;
    } else {
      this.setUserLoggedInStore(false);
      return false;
    }
  }

  ngOnDestroy(): void {
    this.authErrorMessage$.subscribe();
    this.authSuccessMessage$.subscribe();
    this.userLoggedIn$.subscribe();
  }
  
}
