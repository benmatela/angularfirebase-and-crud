import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  
  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(environment.tokenKey);
    window.sessionStorage.setItem(environment.tokenKey, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(environment.tokenKey);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(environment.userKey);
    window.sessionStorage.setItem(environment.userKey, JSON.stringify(user));
  }

  public removeUser(): void {
    window.sessionStorage.removeItem(environment.userKey);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(environment.userKey);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
}
