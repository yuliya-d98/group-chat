import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../axios/api';
import '../styles/dialogs.scss';
import DialogItem from './dialogs/DialodItem';

type DialogsProps = {
    username: string;
    image: string | null;
};

const Dialogs: FC<DialogsProps> = ({ username, image }) => {
    const [isInfoShowing, setIsInfoShowing] = useState(false);

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
                {isInfoShowing && (
                    <div className="dialogs__header_info">
                        <img
                            onClick={getUserInfo}
                            src={image || ''}
                            className="dialogs__header_info_img"
                            alt="avatar"
                        />
                        <p className="dialogs__header_info_username">
                            Твой юзернейм:
                            <br />
                            <b>{username || 'Без имени'}</b>
                        </p>
                    </div>
                )}
                <input type="search" placeholder="Поиск" className="dialogs__header_search" />
            </div>
            <div className="dialogs__groups">
                <DialogItem id={'1'} />
                <DialogItem id={'2'} />
            </div>
        </div>
    );
};

export default Dialogs;
