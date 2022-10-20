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
    lastMsg: null | MessageInfo;
};
export const getGroupsInfo = async () => {
    const data = await instance.get<GroupsInfo>('/groups-info');
    return data.data;
};

type MessageInfo = {
    _id: string;
    text: string;
    date: string;
    author: string;
    groupId: string;
};
export const getMessageInfo = async () => {
    const data = await instance.get<MessageInfo>('/groups-info');
    return data.data;
};
