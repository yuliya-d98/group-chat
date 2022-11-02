import { FC, memo } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { GroupsInfo } from '../../typings/typings';
import { getDate } from '../../utils/getDate';
import { imageSrc } from '../../utils/imageSrc';

const DialogItem: FC<GroupsInfo> = memo(
  ({ _id, groupName, groupImg, unseenCount, lastMsgInfo }) => {
    const [params] = useSearchParams();
    const isActive = params.getAll('id').includes(_id);
    const classname = (): string =>
      isActive ? ['dialogs__group', 'active'].join(' ') : 'dialogs__group';
    const lastMsgTime = lastMsgInfo ? getDate(lastMsgInfo?.date) : '';

    return (
      <NavLink to={`chat?id=${_id}`} className={classname}>
        <img src={imageSrc(groupImg)} className="dialogs__group_avatar" alt="avatar" />
        <div className="dialogs__group_text">
          <p className="dialogs__group_text_title">{groupName}</p>
          <p className="dialogs__group_text_msg">{lastMsgInfo?.text || <i>No messages</i>}</p>
        </div>
        <p className="dialogs__group_time">{lastMsgTime}</p>
      </NavLink>
    );
  }
);

export default DialogItem;
