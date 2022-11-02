import { getGroupInfo, getMessagesInfo } from '../axios/api';
import { GroupsInfo, MessageInfo } from '../typings/typings';
import { BaseThunkType, InferActionsTypes } from './store';

const initialState = {
  messages: [] as MessageInfo[],
  currentChat: null as GroupsInfo | null,
  isFetching: false,
};

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;

const messagesReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
  switch (action.type) {
    case 'messages/SET_GROUP_DATA':
      return {
        ...state,
        currentChat: action.groupInfo,
      };
    case 'messages/SET_MESSAGES_DATA':
      return {
        ...state,
        messages: action.messagesInfo,
      };
    case 'messages/SET_NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case 'messages/TOGGLE_IS_FETCHING':
      return {
        ...state,
        isFetching: action.isFetching,
      };
    default:
      return state;
  }
};

export default messagesReducer;

export const actions = {
  setGroupData: (groupInfo: GroupsInfo) =>
    ({
      type: 'messages/SET_GROUP_DATA',
      groupInfo: groupInfo,
    } as const),
  setMessagesData: (messagesInfo: MessageInfo[]) =>
    ({
      type: 'messages/SET_MESSAGES_DATA',
      messagesInfo: messagesInfo,
    } as const),
  setNewMessage: (message: MessageInfo) =>
    ({
      type: 'messages/SET_NEW_MESSAGE',
      message: message,
    } as const),
  toggleIsFetching: (isFetching: boolean) =>
    ({
      type: 'messages/TOGGLE_IS_FETCHING',
      isFetching: isFetching,
    } as const),
};

type ThunkType = BaseThunkType<ActionsTypes>;

export const getMessagesInfoTC =
  (chatId: string): ThunkType =>
  async (dispatch) => {
    dispatch(actions.toggleIsFetching(true));
    const groupInfo = await getGroupInfo(chatId);
    dispatch(actions.setGroupData(groupInfo));
    const messagesInfo = await getMessagesInfo(chatId);
    dispatch(actions.setMessagesData(messagesInfo));
    dispatch(actions.toggleIsFetching(false));
  };

export const setNewMessageTC =
  (msg: MessageInfo): ThunkType =>
  async (dispatch) => {
    dispatch(actions.setNewMessage(msg));
  };
