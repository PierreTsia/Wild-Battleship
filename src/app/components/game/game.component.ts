import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';



import { AuthService } from '../../auth.service';
import { GameService } from '../../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {
  public eventStatus;
  

  constructor(private db: AngularFireDatabase, public authService: AuthService, public gameService: GameService) {

  }


  ngOnInit() {
   
    this.gameService.eventObserver.subscribe((event) => {
      this.eventStatus = event;
      console.log("event : "+event)
    });
    this.gameService.checkMyUserNumber(this.authService.user).subscribe((playerNumber) => {
      
    });
    this.db.object('room/event')
    .set(this.gameService.message[3]);
   
  }

  
  
}