import {Routes} from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { GameComponent } from '../game/game.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { AuthGuard } from '../../guard/auth.guard';
import {GameGridComponent} from '../game-grid/game-grid.component';

export const appRoutes: Routes = [
  {path:'', component:HomeComponent},
  {path:'game',/*canActivate: [AuthGuard],*/ component:GameComponent},
  {path:'auth', component:AuthenticationComponent},
  {path:'grid', component:GameGridComponent}

]