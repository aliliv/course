import * as actiontypes from '../actions/actionTypes';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
};
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case actiontypes.ChangeTheme:
      return { ...state, theme: action.data };
    default:
      return state;
  }
}

export default rootReducer;
