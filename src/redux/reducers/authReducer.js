import * as actiontypes from "../actions/actionTypes";
const authReducer = (
  state = window.sessionStorage.getItem("Token"),
  action
) => {
  switch (action.type) {
    case actiontypes.LoginUser:
      return (state = window.sessionStorage.getItem("Token"));
    case actiontypes.LogauttUser:

      return (state = window.sessionStorage.getItem("Token"));
    default:
      return state;
  }
};
export default authReducer;
