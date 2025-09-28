/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PropsWithChildren } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { walletReducer } from '../modules/wallet/reducer'
import { walletSaga } from '../modules/wallet/sagas'
import { legacy_createStore as createStore } from 'redux'

const rootReducer = combineReducers({
  wallet: walletReducer,
})
export type TestRootState = ReturnType<typeof rootReducer>

export function makeTestStore(preloadedState?: Partial<TestRootState>) {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(rootReducer, preloadedState, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(walletSaga)
  return store
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = makeTestStore(preloadedState),
    ...renderOptions
  }: { preloadedState?: Partial<TestRootState>; store?: any } & Omit<RenderOptions, 'wrapper'> = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>) {
    return <Provider store={store}>{children}</Provider>
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
