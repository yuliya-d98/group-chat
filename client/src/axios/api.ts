import { instance } from './instance';

type UserInfo = {
  _id: string;
  username: string;
  img: string;
  userId: string;
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
  const data = await instance.get<GroupsInfo[]>('/groups-info');
  return data.data;
};
export const getGroupInfo = async (groupId: string) => {
  const data = await instance.get<GroupsInfo>(`/group?id=${groupId}`);
  return data.data;
};

type MessageInfo = {
  _id: string;
  text: string;
  date: string;
  author: string;
  groupId: string;
};
export const getMessagesInfo = async (chatId: string) => {
  const data = await instance.get<MessageInfo[]>(`/messages?groupId=${chatId}`);
  return data.data;
};
