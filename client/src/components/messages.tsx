import { FC, FormEvent, useRef, useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { ContextType } from '../App';
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { getMessagesInfoTC } from '../redux/messagesReducer';
import '../styles/messages.scss';
import { imageSrc } from '../utils/imageSrc';
import MessagesDateItem from './messages/MessagesDateItem';
import MyMsg from './messages/MyMsg';
import SomeonesMsg from './messages/SomeonesMsg';

const Messages: FC = () => {
  const { socket } = useOutletContext<ContextType>();
  const messagesContainer = useRef<HTMLDivElement | null>(null);

  const userId = useTypedSelector((state) => state.user.userId);
  const group = useTypedSelector((state) => state.messages.currentChat);
  const imgSrc = group ? imageSrc(group.groupImg) : '';
  const messages = useTypedSelector((state) => state.messages.messages);
  const isLoading = useTypedSelector((state) => state.messages.isFetching);
  const [newMsg, setNewMsg] = useState('');

  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('id');

  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (groupId) {
      dispatch(getMessagesInfoTC(groupId));
    }
  }, []);

  useEffect(() => {
    if (groupId) {
      dispatch(getMessagesInfoTC(groupId));
    }
  }, [groupId]);

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
      socket?.emit('send message', newMsg, new Date().toString(), groupId, userId);
      setNewMsg('');
    }
  };

  return (
    <div className="messages" ref={messagesContainer}>
      <div className="messages__header">
        <button className="messages__header_btn" onClick={closeGroup}></button>
        <img src={imgSrc} className="messages__header_img" />
        <p className="messages__header_title">{group?.groupName || 'Group name'}</p>
      </div>
      <div className="messages__msgs">
        <p>Chat Id: {groupId}</p>
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
