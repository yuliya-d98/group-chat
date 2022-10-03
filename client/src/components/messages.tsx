import { FormEvent, useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import '../styles/messages.scss';

const Messages = () => {
    const [newMsg, setNewMsg] = useState('');

    const onNewMsgChange = (e: FormEvent<HTMLTextAreaElement>) => {
        setNewMsg(e.currentTarget.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code === 'Enter' && e.shiftKey) {
            e.preventDefault();
            setNewMsg((msg) => msg + '\n');
        } else if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMsg();
        }
    };

    const sendMsg = () => {
        console.log('sendMsg', newMsg);
        setNewMsg('');
    };

    return (
        <div className="messages">
            <div className="messages__header">
                <button className="messages__header_btn"></button>
                <img src="../assets/img/groupImage.png" className="messages__header_img" />
                <p className="messages__header_title">Group 2</p>
            </div>
            <div className="messages__msgs">
                <p className="messages__msgs_date">31/10/2022</p>
                <SomeonesMsg />
                <MyMsg />
            </div>
            <div className="messages__write">
                <ReactTextareaAutosize
                    minRows={1}
                    maxRows={5}
                    value={newMsg}
                    onInput={onNewMsgChange}
                    onKeyDown={onKeyDown}
                    placeholder="Введите свое сообщение здесь..."
                    className="messages__write_input"
                />
                <button className="messages__write_btn"></button>
            </div>
        </div>
    );
};

export default Messages;

const SomeonesMsg = () => {
    return (
        <div className="messages__msgs_item someone-msg">
            <img src="../assets/img/groupImage.png" className="messages__msgs_item_avatar" />
            <div className="messages__msgs_item_texts">
                <p className="messages__msgs_item_texts_text">message 1</p>
                <p className="messages__msgs_item_texts_time">16:45</p>
            </div>
        </div>
    );
};

const MyMsg = () => {
    return (
        <div className="messages__msgs_item my-msg">
            <div className="messages__msgs_item_texts">
                <p className="messages__msgs_item_texts_text">message 2</p>
                <p className="messages__msgs_item_texts_time">16:45</p>
            </div>
        </div>
    );
};
