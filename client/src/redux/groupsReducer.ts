import { getGroupsInfo } from '../axios/api';
import { GroupsInfo } from '../typings/typings';
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
