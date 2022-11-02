import React, { FC, memo, FormEvent, useRef, useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { ContextType } from '../App';
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { getMessagesInfoTC, setNewMessageTC } from '../redux/messagesReducer';
import '../styles/messages.scss';
import { MessageInfo } from '../typings/typings';
import { imageSrc } from '../utils/imageSrc';
import MessagesDateItem from './messages/MessagesDateItem';
import MyMsg from './messages/MyMsg';
import SomeonesMsg from './messages/SomeonesMsg';
import Preloader from './preloader';

const Messages: FC = memo(() => {
  //   const { socket } = useOutletContext<ContextType>();
  const messagesContainer = useRef<HTMLDivElement | null>(null);

  const socket = useTypedSelector((state) => state.socket.socket);
  const userId = useTypedSelector((state) => state.user.userId);
  const group = useTypedSelector((state) => state.messages.currentChat);
  const imgSrc = group ? imageSrc(group.groupImg) : '';
  const isLoading = useTypedSelector((state) => state.messages.isFetching);
  const [newMsg, setNewMsg] = useState('');

  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('id');

  const dispatch = useTypedDispatch();

  const getMessages = () => {
    if (groupId) {
      dispatch(getMessagesInfoTC(groupId));
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    getMessages();
  }, [groupId]);

  useEffect(() => {
    if (socket) {
      socket.on('get message', (chatId: string, message: MessageInfo) => {
        if (chatId === groupId) {
          dispatch(setNewMessageTC(message));
        }
      });
    }
  }, [socket]);

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
      const date = new Date().toString();
      socket?.emit('send message', newMsg, date, groupId, userId);
      setNewMsg('');
    }
  };

  return (
    <div className="messages" ref={messagesContainer}>
      {isLoading && <Preloader size="100" />}
      <div className="messages__header">
        <button className="messages__header_btn" onClick={closeGroup}></button>
        <img src={imgSrc} className="messages__header_img" />
        <p className="messages__header_title">{group?.groupName || 'Group name'}</p>
      </div>
      <div className="messages__msgs">
        <MessagesItems />
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
});

export default Messages;

const MessagesItems = memo(() => {
  const messages = useTypedSelector((state) => state.messages.messages);
  const userId = useTypedSelector((state) => state.user.userId);
  let daysCount = 0;

  const getDay = (date: string) => {
    return new Date(date).getDate();
  };

  return (
    <>
      {messages && (
        <>
          {messages.map((msg) => {
            const isNewDay = getDay(msg.date) !== daysCount;
            if (isNewDay) {
              daysCount = getDay(msg.date);
            }
            const isMineMsg = msg.author.authorId === userId;
            if (isNewDay && isMineMsg) {
              return (
                <React.Fragment key={msg._id}>
                  <MessagesDateItem text={msg.date} />
                  <MyMsg {...msg} />
                </React.Fragment>
              );
            } else if (!isNewDay && isMineMsg) {
              return <MyMsg {...msg} key={msg._id} />;
            } else if (isNewDay && !isMineMsg) {
              return (
                <React.Fragment key={msg._id}>
                  <MessagesDateItem text={msg.date} />
                  <SomeonesMsg {...msg} />
                </React.Fragment>
              );
            } else {
              return <SomeonesMsg {...msg} key={msg._id} />;
            }
          })}
        </>
      )}
    </>
  );
});
