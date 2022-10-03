import { FC } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dialogs.scss';

const Dialogs = () => {
    return (
        <div className="dialogs">
            <div className="dialogs__header">
                <Link to="" className="dialogs__header_logo" />
                <input type="search" placeholder="Поиск" className="dialogs__header_search" />
            </div>
            <div className="dialogs__groups">
                <DialogItem isActive={true} />
                <DialogItem isActive={false} />
            </div>
        </div>
    );
};

export default Dialogs;

type DialogItemProps = {
    isActive: boolean;
};

const DialogItem: FC<DialogItemProps> = ({ isActive }) => {
    const classname = isActive ? ['dialogs__group', 'active'].join(' ') : 'dialogs__group';

    return (
        <div className={classname}>
            <img
                src="../assets/img/groupImage.png"
                className="dialogs__group_avatar"
                alt="avatar"
            />
            <div className="dialogs__group_text">
                <p className="dialogs__group_text_title">Group 1</p>
                <p className="dialogs__group_text_msg">Any message here fbhdv</p>
            </div>
            <p className="dialogs__group_time">16:45</p>
        </div>
    );
};
