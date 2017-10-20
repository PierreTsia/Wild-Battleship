import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';



import { AuthService } from '../../auth.service';
import { GameService } from '../../game.service';

/*animation import*/ import { slideInOutAnimation } from '../../animations/index';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  // make slide in out animation available to this component
  animations: [slideInOutAnimation],
  
     // attach the slide in out animation to the host (root) element of this component
     host: { '[@slideInOutAnimation]': '' }
})

export class GameComponent implements OnInit {
  public eventStatus;
  public winnerDeclared;

  constructor(private db: AngularFireDatabase, public authService: AuthService, public gameService: GameService) {

  }

  

  ngOnInit() {
   
    this.gameService.eventObserver.subscribe((event) => {
      this.eventStatus = event;
      console.log("event : "+event)
    });
    this.gameService.checkMyUserNumber(this.authService.user).subscribe((playerNumber) => {
      
    });
    this.gameService.winnerObserver.subscribe((winner)=>{
      this.winnerDeclared = winner;
    })
    this.db.object('room/event')
    .set(this.gameService.message[3]);
   
  }

 
  

}