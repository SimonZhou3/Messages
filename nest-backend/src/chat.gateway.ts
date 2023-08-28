import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('sendMessage')
    handleMessage(client: any, payload: any): void {
        console.log('we enter here!!');
        this.server.emit('getMessage', payload);
    }
}
