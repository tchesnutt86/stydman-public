import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../core/current-user.service';

@Component({
  selector: 'app-side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss']
})
export class SideNavigationMenuComponent implements OnInit {
  // loggedInWithAdmin = false;

  constructor(public currentUserService: CurrentUserService) { }

  ngOnInit() {
    // try {
    //   const val = document.cookie
    //     .split(';')
    //     .filter(__c => __c.includes('admin='))[0]
    //     .replace('admin=', '');
    //   const isAdmin = JSON.parse(val);

    //   this.loggedInWithAdmin = isAdmin;
    // } catch {
    //   this.loggedInWithAdmin = false;
    // }
  }

}
