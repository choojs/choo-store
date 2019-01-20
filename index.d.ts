/// <reference types="node" />

import * as EventEmitter from 'events'
import Choo from 'choo'
type Emitter = (
  data: any,
  store: string,
  emitter: EventEmitter,
  state: Choo.IState,
  app: Choo
) => void

declare namespace ChooStore {
  export interface InitialState {
    [key:string]: any
  }

  export interface Events {
    [key:string]: Emitter
  }

  export function Emitter(): Emitter
}

declare function ChooStore (
  storeName:string, 
  initialState:ChooStore.InitialState, 
  events:ChooStore.Events
 ): (state:Choo.IState, emitter: EventEmitter, app: Choo) => void

export = ChooStore