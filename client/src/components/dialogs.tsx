import { FC, memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { updateLastMsg } from '../redux/groupsReducer';
import '../styles/dialogs.scss';
import { GroupsInfo, MessageInfo } from '../typings/typings';
import DialogItem from './dialogs/DialodItem';
import Preloader from './preloader';

const Dialogs: FC = memo(() => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [isInfoShowing, setIsInfoShowing] = useState(false);
  const groups = useTypedSelector((state) => state.groups.groups);
  const [sortedGroups, setSortedGroups] = useState<GroupsInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const socket = useTypedSelector((state) => state.socket.socket);
  const isLoading = useTypedSelector((state) => state.groups.isFetching);
  const dispatch = useTypedDispatch();

  const toggleInfo = () => {
    setIsInfoShowing((isInfoShowing) => !isInfoShowing);
  };

  useEffect(() => {
    if (groups) {
      const sorted = groups.filter((g) => g.groupName.includes(searchQuery));
      setSortedGroups(sorted);
    }
  }, [groups, searchQuery]);

  useEffect(() => {
    if (socket) {
      socket.on('update last message', (groupId: string, message: MessageInfo) => {
        dispatch(updateLastMsg(groupId, message));
      });
    }
  }, [socket]);

  return (
    <div className="dialogs">
      <div className="dialogs__header" ref={headerRef}>
        <div className="dialogs__header_container">
          <Link to="/" className="dialogs__header_logo" />
          <button className="dialogs__header_btn" onClick={toggleInfo}>
            ▼
          </button>
        </div>
        {isInfoShowing && <UserInfo />}
        <input
          type="search"
          value={searchQuery}
          onInput={(e: React.FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value)}
          placeholder="Поиск"
          className="dialogs__header_search"
        />
      </div>
      <div className="dialogs__groups">
        {isLoading && <Preloader size="50" />}
        {!sortedGroups.length && <p className="dialogs__groups_warn">No groups available</p>}
        {sortedGroups && sortedGroups.map((group) => <DialogItem {...group} key={group._id} />)}
      </div>
    </div>
  );
});

export default Dialogs;

const UserInfo = memo(() => {
  const userImage = useTypedSelector((state) => state.user.img);
  const username = useTypedSelector((state) => state.user.username);
  const isLoading = useTypedSelector((state) => state.user.isFetching);

  const imgSrc = userImage ? `data:image/png;base64,${userImage}` : '';

  return (
    <div className="dialogs__header_info">
      {isLoading && <Preloader size="50" />}
      <img src={imgSrc} className="dialogs__header_info_img" alt="avatar" />
      <p className="dialogs__header_info_username">
        Твой юзернейм:
        <br />
        <b>{username || 'Без имени'}</b>
      </p>
    </div>
  );
});
