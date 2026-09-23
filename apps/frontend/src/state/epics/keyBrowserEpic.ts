import { tap } from "rxjs/operators"
import { merge } from "rxjs"
import { selectKeyBrowserState } from "../valkey-features/keys/keyBrowserSelectors"
import { getSocket } from "./wsEpics"
import {
  getKeysRequested,
  loadMoreKeys,
  getKeyTypeRequested,
  deleteKeyRequested,
  addKeyRequested,
  updateKeyRequested
} from "../valkey-features/keys/keyBrowserSlice"
import { action$, select } from "../middleware/rxjsMiddleware/rxjsMiddleware"
import type { Store } from "@reduxjs/toolkit"

export const keyBrowserEpic = (store: Store) =>
  merge(
    action$.pipe(
      select(loadMoreKeys),
      tap(({ payload: { connectionId } }) => {
        const state = selectKeyBrowserState(connectionId)(store.getState())
        if (state.pageLoading || state.loading || !state.cursor || state.cursor === "0") return
        store.dispatch(getKeysRequested({
          connectionId, cursor: state.restartRequired ? undefined : state.cursor, pattern: state.pattern, keyType: state.keyType,
        }))
      }),
    ),
    // for getting all keys (getKeys)
    action$.pipe(
      select(getKeysRequested),
      tap((action) => {
        const socket = getSocket()
        console.debug("Sending getKeys request to server...")
        socket.next(action)
      }),
    ),

    // for getting a key type and ttl (getKeyInfo)
    action$.pipe(
      select(getKeyTypeRequested),
      tap((action) => {
        const socket = getSocket()
        console.debug("Sending getKeyType request to server...")
        socket.next(action)
      }),
    ),

    // for deleting a key (deleteKey)
    action$.pipe(
      select(deleteKeyRequested),
      tap((action) => {
        const socket = getSocket()
        console.debug("Sending deleteKey request to server...")
        socket.next(action)
      }),
    ),

    // add new key (addKey)
    action$.pipe(
      select(addKeyRequested),
      tap((action) => {
        const socket = getSocket()
        console.debug("Sending addKey request to server...")
        socket.next(action)
      }),
    ),

    // update existing key (updateKey)
    action$.pipe(
      select(updateKeyRequested),
      tap((action) => {
        const socket = getSocket()
        console.debug("Sending updateKey request to server...")
        socket.next(action)
      }),
    ),
  )
