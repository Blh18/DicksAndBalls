import { Card, Suit } from './card'
import { Opponent } from './player'
import { PlayerAction } from './playerAction'

interface Message {
    readonly type: string
}

export interface ErrorMessage extends Message {
    type: 'error'
    message: string
}

// ------------------------- Client -------------------------

export interface JoinTableMessage extends Message {
    type: 'join_table'
    id: string
}

export interface AddPlayerMessage extends Message {
    type: 'add_player'
    player: string
}

export interface RemovePlayerMessage extends Message {
    type: 'remove_player'
}

export interface ChangeGameStateMessage extends Message {
    type: 'change_game'
    active: boolean
}

export interface PlayersTurnMessage extends Message {
    type: 'players_turn'
    action: PlayerAction
}

export type ClientMessage =
  ErrorMessage |
  JoinTableMessage |
  AddPlayerMessage |
  RemovePlayerMessage |
  ChangeGameStateMessage |
  PlayersTurnMessage

export function isJoinTableMessage(message: Message): message is JoinTableMessage {
    return message.type === 'join_table'
}

export function isAddPlayerMessage(message: Message): message is AddPlayerMessage {
    return message.type === 'add_player'
}

export function isRemovePlayerMessage(message: ClientMessage): message is RemovePlayerMessage {
    return message.type === 'remove_player'
}

export function isChangeGameMessage(message: Message): message is ChangeGameStateMessage {
    return message.type === 'change_game'
}

export function isPlayersTurnMessage(message: Message): message is PlayersTurnMessage {
    return message.type === 'players_turn'
}

// ------------------------- Server -------------------------

export interface GameStateMessage extends Message {
    type: 'game_state'
    active: boolean
    players: Opponent[]
}

export interface GameUpdateMessage extends Message {
    type: 'game_update'
    deckTop: Card[]
    message: string
    cardsInDeck: string
    playerOnTurn?: string
    colorChangedTo?: Suit
    skippingNextPlayer: boolean
    broughtBackToGame?: string
    drewCards: number
    shouldDraw: number
}

export interface PlayerUpdateMessage extends Message {
    type: 'player_update'
    cards: Card[]
    place: number
    loser: boolean
}

// ------------------------- Tables -------------------------

export interface TableInfo {
    id: string
    name: string
    playersCount: number
}

export interface TableUpdateMessage extends Message {
    type: 'table_update'
    tables: TableInfo[]
}

export interface AddTableMessage extends Message {
    type: 'add_table'
    name: string
}

export function isAddTableMessage(message: Message): message is AddTableMessage {
    return message.type === 'add_table'
}

export function isTableUpdateMessage(message: Message): message is TableUpdateMessage {
    return message.type === 'table_update'
}
