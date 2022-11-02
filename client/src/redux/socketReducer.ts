import { Socket } from 'socket.io-client';
import { BaseThunkType, InferActionsTypes } from './store';

const initialState = {
  socket: null as Socket | null,
};

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;

const socketReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
  switch (action.type) {
    case 'socket/SET_SOCKET':
      return {
        ...state,
        socket: action.socket,
      };
    default:
      return state;
  }
};

export default socketReducer;

export const actions = {
  setSocket: (socket: Socket | null) =>
    ({
      type: 'socket/SET_SOCKET',
      socket: socket,
    } as const),
};

type ThunkType = BaseThunkType<ActionsTypes>;

export const setSocketTC =
  (socket: Socket | null): ThunkType =>
  async (dispatch) => {
    dispatch(actions.setSocket(socket));
  };
