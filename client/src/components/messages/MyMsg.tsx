import { FC } from 'react';

const MyMsg: FC = () => {
    return (
        <div className="messages__msgs_item my-msg">
            <div className="messages__msgs_item_texts">
                <p className="messages__msgs_item_texts_text">message 2</p>
                <p className="messages__msgs_item_texts_time">16:45</p>
            </div>
        </div>
    );
};

export default MyMsg;
