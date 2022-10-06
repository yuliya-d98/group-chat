import { instance } from './instance';

type UserInfo = {
    _id: string;
    username: string;
    img: string;
    sessionId: string;
};
export const getUserInfo = async () => {
    const data = await instance.get<UserInfo>('/user-info');
    return data.data;
};

type GroupsInfo = {
    _id: string;
    groupName: string;
    groupImg: string;
    groupMembersIds: string[];
    unseenCount: number;
    lastMsgId: null | MessageInfo;
};
export const getGroupsInfo = async () => {
    const data = await instance.get<GroupsInfo>('/groups-info');
    return data.data;
};

type MessageInfo = {
    text: string;
    date: string;
    author: string;
    seenbBy: string[];
    groupId: string;
};
