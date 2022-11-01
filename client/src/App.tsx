import React, { useEffect, useRef } from 'react';
import { HashRouter, BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dialogs from './components/dialogs';
import Welcome from './components/Welcome';
import Error from './components/Error';
import Messages from './components/messages';
import './styles/page.scss';
import { io, Socket } from 'socket.io-client';
import { useTypedDispatch, useTypedSelector } from './hooks/redux';
import { getUserInfoTC } from './redux/userReducer';
import { getGroupsInfoTC } from './redux/groupsReducer';
import store from './redux/store';
import { Provider } from 'react-redux';

const socketURL = process.env.REACT_APP_SOCKET_URL as string;

export type ContextType = {
  socket: Socket | null;
};

const Page = () => {
  const userId = useTypedSelector((state) => state.user.userId);
  const socket = useRef<Socket | null>(null);

  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(getUserInfoTC());
    dispatch(getGroupsInfoTC());
  }, []);

  useEffect(() => {
    if (userId && !socket.current) {
      socket.current = io(socketURL, { transports: ['websocket'] });
    }
  }, [userId]);

  return (
    <div className="page">
      <Dialogs />
      <Outlet context={{ socket: socket.current }} />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {/* <HashRouter basename="/"> */}
        <Routes>
          <Route path="/" element={<Page />}>
            <Route index element={<Welcome />} />
            <Route path="chat" element={<Messages />} />
            <Route path="error" element={<Error />} />
            <Route path="*" element={<Navigate to="/error" replace />} />
          </Route>
        </Routes>
        {/* </HashRouter> */}
      </BrowserRouter>
    </Provider>
  );
}

export default App;
