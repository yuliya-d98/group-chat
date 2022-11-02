import { GroupsInfo, MessageInfo, UserInfo } from '../typings/typings';
import { instance } from './instance';

export const getUserInfo = async () => {
  const data = await instance.get<UserInfo>('/user-info');
  return data.data;
};

export const getGroupsInfo = async () => {
  const data = await instance.get<GroupsInfo[]>('/groups-info');
  return data.data;
};
export const getGroupInfo = async (groupId: string) => {
  const data = await instance.get<GroupsInfo>(`/group?id=${groupId}`);
  return data.data;
};

export const getMessagesInfo = async (chatId: string) => {
  const data = await instance.get<MessageInfo[]>(`/messages?groupId=${chatId}`);
  return data.data;
};
