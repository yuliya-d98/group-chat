import { getGroupsInfo } from '../axios/api';
import { GroupsInfo, MessageInfo } from '../typings/typings';
import { BaseThunkType, InferActionsTypes } from './store';

const initialState = {
  groups: [] as GroupsInfo[],
  isFetching: false,
};

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>;

const groupsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
  switch (action.type) {
    case 'groups/SET_GROUPS_DATA':
      return {
        ...state,
        groups: action.groupsInfo,
      };
    case 'groups/UPDATE_LAST_MSG':
      const updatedGroups = state.groups.map((g) => {
        if (g._id === action.groupId) {
          return { ...g, lastMsgInfo: action.message };
        }
        return g;
      });
      return {
        ...state,
        groups: updatedGroups,
      };
    case 'groups/TOGGLE_IS_FETCHING':
      return {
        ...state,
        isFetching: action.isFetching,
      };
    default:
      return state;
  }
};

export default groupsReducer;

export const actions = {
  setGroupsData: (groupsInfo: GroupsInfo[]) =>
    ({
      type: 'groups/SET_GROUPS_DATA',
      groupsInfo: groupsInfo,
    } as const),
  updateLastMsg: (groupId: string, message: MessageInfo) =>
    ({
      type: 'groups/UPDATE_LAST_MSG',
      groupId: groupId,
      message: message,
    } as const),
  toggleIsFetching: (isFetching: boolean) =>
    ({
      type: 'groups/TOGGLE_IS_FETCHING',
      isFetching: isFetching,
    } as const),
};

type ThunkType = BaseThunkType<ActionsTypes>;

export const getGroupsInfoTC = (): ThunkType => async (dispatch) => {
  dispatch(actions.toggleIsFetching(true));
  const groupsInfo = await getGroupsInfo();
  dispatch(actions.setGroupsData(groupsInfo));
  dispatch(actions.toggleIsFetching(false));
};

export const updateLastMsg =
  (groupId: string, message: MessageInfo): ThunkType =>
  async (dispatch) => {
    dispatch(actions.updateLastMsg(groupId, message));
  };
