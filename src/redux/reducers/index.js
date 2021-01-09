import { combineReducers } from 'redux';
import authReducer from './authReducer';
import rootReducer from './rootReducer';

const reducers = combineReducers({
  authReducer,
  rootReducer,
});
export default reducers;
