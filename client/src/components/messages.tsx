import { FC, FormEvent, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { ContextType } from '../App';
import '../styles/messages.scss';
import MessagesDateItem from './messages/MessagesDateItem';
import MyMsg from './messages/MyMsg';
import SomeonesMsg from './messages/SomeonesMsg';

const Messages: FC = () => {
    const { userId, socket } = useOutletContext<ContextType>();
    const messagesContainer = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const params = useParams();

    const onNewMsgChange = (e: FormEvent<HTMLTextAreaElement>) => {
        setNewMsg(e.currentTarget.value);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code === 'Enter' && e.shiftKey) {
            e.preventDefault();
            setNewMsg((msg) => msg + '\n');
        } else if (e.code === 'Enter' && !e.shiftKey) {
            sendMsg(e);
        }
    };

    const closeGroup = () => {
        messagesContainer.current?.classList.remove('show');
    };

    const sendMsg = (
        e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();
        if (newMsg) {
            socket?.emit('send message', newMsg, new Date().toString(), params.id, userId);
            setNewMsg('');
        }
    };

    return (
        <div className="messages" ref={messagesContainer}>
            <div className="messages__header">
                <button className="messages__header_btn" onClick={closeGroup}></button>
                <img src="../assets/img/groupImage.png" className="messages__header_img" />
                <p className="messages__header_title">Group 2</p>
            </div>
            <div className="messages__msgs">
                <p>Chat Id: {params.id}</p>
                <MessagesDateItem date="31/10/2022" />
                <SomeonesMsg />
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
                <button className="messages__write_btn" onClick={sendMsg}></button>
            </div>
        </div>
    );
};

export default Messages;
