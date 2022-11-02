export type UserInfo = {
  _id: string;
  username: string;
  img: string;
  userId: string;
};

export type GroupsInfo = {
  _id: string;
  groupName: string;
  groupImg: string;
  groupMembersIds: string[];
  unseenCount: number;
  lastMsgInfo: null | MessageInfo;
};

export type MessageInfo = {
  _id: string;
  text: string;
  date: string;
  author: string;
  groupId: string;
};
