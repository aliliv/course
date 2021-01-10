import * as actionTypes from './actionTypes';

export const changeTheme = (data) => {
  return {
    type: actionTypes.ChangeTheme,
    data,
  };
};
