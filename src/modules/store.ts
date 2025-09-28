// src/modules/store.ts
import { applyMiddleware, createStore } from 'redux'
import createSagasMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { reducer } from './reducer'
import { sagas } from './sagas'

const sagasMiddleware = createSagasMiddleware()
const loggerMiddleware = createLogger({ collapsed: () => true })

const middleware = applyMiddleware(sagasMiddleware, loggerMiddleware)
const store = createStore(reducer, middleware)

sagasMiddleware.run(sagas)

export type RootState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch

export { store }
