import { Action, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import groupsReducer from './groupsReducer';
import messagesReducer from './messagesReducer';
import userReducer from './userReducer';

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const composeEnhancers = compose;

const rootReducer = combineReducers({
  user: userReducer,
  groups: groupsReducer,
  messages: messagesReducer,
});

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;
export type BaseThunkType<A extends Action = Action, R = Promise<void>> = ThunkAction<
  R,
  AppStateType,
  unknown,
  A
>;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

export default store;

// type PropertiesTypes<T> = T extends { [key: string]: infer U } ? U : never;
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type InferActionsTypes<T extends { [key: string]: (...args: any[]) => any }> = ReturnType<
//   PropertiesTypes<T>
// >;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferActionsTypes<T> = T extends { [keys: string]: (...args: any[]) => infer U }
  ? U
  : never;
