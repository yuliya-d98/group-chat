import { FC } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useTypedDispatch } from '../../hooks/redux';
import { getMessagesInfoTC } from '../../redux/messagesReducer';
import { GroupsInfo } from '../../typings/typings';
import { getDate } from '../../utils/getDate';

const DialogItem: FC<GroupsInfo> = ({
  _id,
  groupName,
  groupImg,
  groupMembersIds,
  unseenCount,
  lastMsgInfo,
}) => {
  const [params] = useSearchParams();
  const isActive = params.getAll('id').includes(_id);
  const classname = (): string =>
    isActive ? ['dialogs__group', 'active'].join(' ') : 'dialogs__group';
  const lastMsgTime = lastMsgInfo ? getDate(lastMsgInfo?.date) : '16:45';

  return (
    <NavLink to={`chat?id=${_id}`} className={classname}>
      <img
        src={`data:image/png;base64,${groupImg}`}
        className="dialogs__group_avatar"
        alt="avatar"
      />
      <div className="dialogs__group_text">
        <p className="dialogs__group_text_title">{groupName}</p>
        <p className="dialogs__group_text_msg">{lastMsgInfo?.text || 'Any message here fbhdv'}</p>
      </div>
      <p className="dialogs__group_time">{lastMsgTime}</p>
    </NavLink>
  );
};

export default DialogItem;
