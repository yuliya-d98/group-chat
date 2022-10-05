import { FC } from 'react';
import { NavLink } from 'react-router-dom';

type DialogItemProps = {
    id: string;
};

const DialogItem: FC<DialogItemProps> = ({ id }) => {
    const classname = ({ isActive }: { isActive: boolean }): string =>
        isActive ? ['dialogs__group', 'active'].join(' ') : 'dialogs__group';

    return (
        <NavLink to={`chat/${id}`} className={classname}>
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
        </NavLink>
    );
};

export default DialogItem;
