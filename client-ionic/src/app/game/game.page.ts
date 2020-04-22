import { Component } from '@angular/core';
import { GameService } from './game.service'
import { Opponent } from './models/opponent'
import { Card, Suit } from './models/card'
import {
  ErrorMessage,
  GameStateMessage,
  GameUpdateMessage,
  isErrorMessage,
  isGameStateMessage,
  isGameUpdateMessage,
  isPlayerUpdateMessage,
  PlayerUpdateMessage,
  RemovePlayerMessage,
  ServerMessage
} from './models/message'
import inactivityDetection from './helpers/inactivityDetection'

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage {
  playerName?: string
  participating = false
  active?: boolean
  players?: Opponent[]
  deckTop?: Card[]
  playerOnTurn?: string
  cards?: Card[]
  lastMessage?: {
    error: boolean
    text: string
  }
  colorChangedTo?: Suit
  isSkippingTurn = false
  shouldDraw = 0
  isWinner = false
  cardsInDeck?: string

  private error = false

  constructor(private gameService: GameService) { }

  // noinspection JSUnusedGlobalSymbols
  ionViewWillEnter(): void {
    this.gameService.getMessages().subscribe(
        this.handleServerMessage,
        () => this.error = true)
    this.gameService.onDisconnect().subscribe(
        this.handleServerDisconnect
    )
  }

  // noinspection JSUnusedGlobalSymbols
  ionViewWillLeave(): void {
    const message: RemovePlayerMessage = {
      type: 'remove_player',
    }
    this.gameService.sendMessage(message)
    this.playerName = undefined
  }

  shouldShowTable(): boolean {
    if (this.error) { return false }
    if (this.active) { return true }
    // if there is a winner/loser among the players show the latest played game
    return !!this.players?.some(player => player.place > 0 || player.loser)
  }

  private handleServerMessage = (message: ServerMessage): void => {
    if (this.error) { this.error = false }
    if (isErrorMessage(message)) {
      this.handleErrorMessage(message)
    } else if (isGameStateMessage(message)) {
      this.handleGameStateUpdate(message)
    } else if (isGameUpdateMessage(message)) {
      this.handleGameUpdate(message)
    } else if (isPlayerUpdateMessage(message)) {
      this.handlePlayerUpdate(message)
    }
  }

  private handleErrorMessage(message: ErrorMessage): void {
    this.lastMessage = {
      error: true,
      text: message.message
    }
  }

  private handleGameStateUpdate(message: GameStateMessage): void {
    const {active, players} = message
    this.active = active
    this.players = players
    this.participating = players.some(player => player.name === this.playerName)
  }

  private handleGameUpdate(message: GameUpdateMessage): void {
    const {
      colorChangedTo,
      deckTop,
      playerOnTurn,
      skippingNextPlayer,
      shouldDraw,
      cardsInDeck,
      broughtBackToGame,
      drewCards
    } = message

    if (playerOnTurn === this.playerName && this.active) { inactivityDetection.startDetecting() }
    if (broughtBackToGame) { this.handleBroughtBackToGame(broughtBackToGame === this.playerName) }
    this.playDrawCardSound(drewCards)

    this.colorChangedTo = colorChangedTo
    this.deckTop = deckTop
    this.playerOnTurn = playerOnTurn
    this.lastMessage = {
      error: false,
      text: message.message,
    }
    this.isSkippingTurn = this.participating && skippingNextPlayer && playerOnTurn === this.playerName
    this.shouldDraw = playerOnTurn === this.playerName ? shouldDraw : 0
    this.cardsInDeck = cardsInDeck
  }

  private handlePlayerUpdate(message: PlayerUpdateMessage): void {
    const {cards, place, loser} = message
    if (place > 0) {
      this.handleWin()
    } else if (loser) {
      this.handleLoss()
    }

    this.cards = cards
    this.isWinner = place > 0
  }

  private handleServerDisconnect = (): void => {
    this.participating = false
    this.error = true
  }

  private async handleWin(): Promise<void> {
    // TODO modal
    const audio = new Audio('assets/sounds/win31.mp3')
    await audio.play()
  }

  private async handleLoss(): Promise<void> {
    // TODO modal
    const audio = new Audio('assets/sounds/sadTrombone.mp3')
    await audio.play()
  }

  private async handleBroughtBackToGame(me: boolean = false): Promise<void> {
    const audio = new Audio('assets/sounds/airHorn.mp3')
    await audio.play()
    // if (me) TODO modal
  }

  private async playDrawCardSound(cards: number): Promise<void> {
    let audioFile: string
    switch (cards) {
      case 4:
        audioFile = 'assets/sounds/crack_the_whip.mp3'
        break
      case 6:
        audioFile = 'assets/sounds/badumtss.mp3'
        break
      case 8:
        audioFile = 'assets/sounds/holy_shit.mp3'
        break
      default:
        return
    }
    const audio = new Audio(audioFile)
    await audio.play()
  }
}
