import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dialogs from './components/dialogs';
import Welcome from './components/Welcome';
import Error from './components/Error';
import Messages from './components/messages';
import './styles/page.scss';
import { getUserInfo } from './axios/api';
import { io, Socket } from 'socket.io-client';

const socketURL = process.env.REACT_APP_SOCKET_URL as string;

export type ContextType = {
    userId: string;
    socket: Socket | null;
};

const Page = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        if (!socket.current) {
            socket.current = io(socketURL, { transports: ['websocket'] });
            getUserInfo()
                .then((userInfo) => {
                    setUsername(userInfo.username);
                    setUserId(userInfo._id);
                    setImage(`data:image/png;base64,${userInfo.img}`);
                })
                .catch((e: ErrorConstructor) => console.error(e));

            return () => {
                // socket.current?.disconnect();
            };
        }
    }, []);

    return (
        <div className="page">
            <Dialogs username={username} image={image} />
            <Outlet context={{ userId, socket: socket.current }} />
        </div>
    );
};

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            {/* <HashRouter basename="/"> */}
            <Routes>
                <Route path="/" element={<Page />}>
                    <Route index element={<Welcome />} />
                    <Route path="chat/:id" element={<Messages />} />
                    <Route path="error" element={<Error />} />
                    <Route path="*" element={<Navigate to="/error" replace />} />
                </Route>
            </Routes>
            {/* </HashRouter> */}
        </BrowserRouter>
    );
}

export default App;
