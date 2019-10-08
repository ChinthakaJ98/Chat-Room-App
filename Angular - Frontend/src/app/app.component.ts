import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WebSocketChatRoom';

  greetings: string[] = [];
  disabled = true;
  newmessage: string;
  private stompClient = null;

  constructor(){}

  ngOnInit() {
    this.connect();
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/testchat');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/start/initial', function (hello) {
        console.log(JSON.parse(hello.body));
        
        _this.showMessage(JSON.parse(hello.body));
      });
    });
  }

  sendMessage() {
    
    this.stompClient.send(
      '/current/resume',
      {},
      JSON.stringify(this.newmessage)
    );
    this.newmessage = "";

  }

  showMessage(message) {
    
      this.greetings.push(message);

  }

}
