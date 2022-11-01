import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTypedSelector } from '../hooks/redux';
import '../styles/dialogs.scss';
import DialogItem from './dialogs/DialodItem';

type DialogsProps = Record<string, never>;

const Dialogs: FC<DialogsProps> = () => {
  const [isInfoShowing, setIsInfoShowing] = useState(false);
  const groups = useTypedSelector((state) => state.groups.groups);
  const isLoading = useTypedSelector((state) => state.groups.isFetching);

  const toggleInfo = () => {
    setIsInfoShowing((isInfoShowing) => !isInfoShowing);
  };

  return (
    <div className="dialogs">
      <div className="dialogs__header">
        <div className="dialogs__header_container">
          <Link to="/" className="dialogs__header_logo" />
          <button className="dialogs__header_btn" onClick={toggleInfo}>
            ▼
          </button>
        </div>
        {isInfoShowing && <UserInfo />}
        <input type="search" placeholder="Поиск" className="dialogs__header_search" />
      </div>
      <div className="dialogs__groups">
        {groups && groups.map((group) => <DialogItem {...group} key={group._id} />)}
      </div>
    </div>
  );
};

export default Dialogs;

const UserInfo = () => {
  const userImage = useTypedSelector((state) => state.user.img);
  const username = useTypedSelector((state) => state.user.username);
  const isLoading = useTypedSelector((state) => state.user.isFetching);

  const imgSrc = userImage ? `data:image/png;base64,${userImage}` : '';

  return (
    <div className="dialogs__header_info">
      <img src={imgSrc} className="dialogs__header_info_img" alt="avatar" />
      <p className="dialogs__header_info_username">
        Твой юзернейм:
        <br />
        <b>{username || 'Без имени'}</b>
      </p>
    </div>
  );
};
