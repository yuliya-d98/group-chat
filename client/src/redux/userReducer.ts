import { getUserInfo } from '../axios/api';
import { UserInfo } from '../typings/typings';
import { BaseThunkType, InferActionsTypes } from './store';

const initialState = {
  _id: null as string | null,
  username: null as string | null,
  img: null as string | null,
  userId: null as string | null,
  isFetching: false,
};

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;

const userReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
  switch (action.type) {
    case 'user/SET_USER_DATA':
      return {
        ...state,
        ...action.userInfo,
      };
    case 'user/TOGGLE_IS_FETCHING':
      return {
        ...state,
        isFetching: action.isFetching,
      };
    default:
      return state;
  }
  console.log(state);
};

export default userReducer;

export const actions = {
  setAuthUserData: (userInfo: UserInfo) =>
    ({
      type: 'user/SET_USER_DATA',
      userInfo: userInfo,
    } as const),
  toggleIsFetching: (isFetching: boolean) =>
    ({
      type: 'user/TOGGLE_IS_FETCHING',
      isFetching: isFetching,
    } as const),
};

type ThunkType = BaseThunkType<ActionsTypes>;

export const getUserInfoTC = (): ThunkType => async (dispatch) => {
  dispatch(actions.toggleIsFetching(true));
  const userInfo = await getUserInfo();
  dispatch(actions.setAuthUserData(userInfo));
  dispatch(actions.toggleIsFetching(false));
};
