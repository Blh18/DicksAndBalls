import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { GamePageRoutingModule } from './game-routing.module'
import { GamePage } from './game.page'
import { SocketIoModule } from 'ngx-socket-io'
import { GameSocket } from './helpers/socket/game.socket'
import { GameService } from './game.service'
import { JoinGameButtonComponent } from './components/join-game-button/join-game-button.component'

@NgModule({
    declarations: [
        GamePage,
        JoinGameButtonComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GamePageRoutingModule,
        SocketIoModule,
    ],
    providers: [
        GameSocket,
        GameService,
    ]
})
export class GamePageModule {
}
