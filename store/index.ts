import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { createWrapper } from 'next-redux-wrapper';
import AuthReducer from './reducers/Auth';
import CategoryPageReducer from './reducers/CategoryPage';

const rootReducer = combineReducers({ AuthReducer, CategoryPageReducer });
export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
