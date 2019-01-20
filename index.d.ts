/// <reference types="node" />

import * as EventEmitter from 'events'
import Choo from 'choo'

type IEmitter = {
  data: any,
  store: string,
  emitter: EventEmitter,
  state: Choo.IState,
  app: Choo
}

declare namespace ChooStore {
  export interface InitialState {
    [key:string]: any
  }

  export interface Events {
    [key:string]: IEmitter
  }

  export function Emitter(args:IEmitter): void

  export interface IChooStore {
    storeName: string
    initialState: InitialState,
    events: Events
  }
}

declare function ChooStore (store:ChooStore.IChooStore): (state:Choo.IState, emitter: EventEmitter, app: Choo) => void

export = ChooStore