import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CurrentUserService } from './current-user.service';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    try {
      const val = document.cookie
        .split(';')
        .filter(__c => __c.includes('isLoggedIn='))[0]
        .replace('isLoggedIn=', '')
        .trim();
      const isLoggedIn: boolean = JSON.parse(val);

      if (isLoggedIn && !this.currentUserService.hasBeenInitialized()) {
        const username = document.cookie
          .split(';')
          .filter(__c => __c.includes('username='))[0]
          .replace('username=', '')
          .trim();

        this.currentUserService.setUser(username);
      }

      this.loggedIn.next(isLoggedIn);
    } catch {
      this.loggedIn.next(false);
    }

    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService,
    private coreService: CoreService,
  ) { }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.coreService.get('login.php', { username, password }).toPromise()
        .then((results: any) => {
          const firstOne = results[0];
          if (firstOne.success) {
            document.cookie = 'isLoggedIn=true';
            document.cookie = `username=${username}`;

            this.loggedIn.next(true);
            this.router.navigate(['/']);

            this.currentUserService.setUser(username);

            resolve(true);
          } else {
            this.loggedIn.next(false);
            resolve(false);
          }
        },
        () => reject(false));
    });
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
