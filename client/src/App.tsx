import React, { useState, useEffect } from 'react';
import { HashRouter, BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dialogs from './components/dialogs';
import Welcome from './components/Welcome';
import Error from './components/Error';
import Messages from './components/messages';
import './styles/page.scss';
import { getUserInfo } from './axios/api';

export type ContextType = {
    userId: string;
};

const Page = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        getUserInfo()
            .then((userInfo) => {
                setUsername(userInfo.username);
                setUserId(userInfo._id);
                setImage(`data:image/png;base64,${userInfo.img}`);
            })
            .catch((e) => console.error(e));
    }, []);

    return (
        <div className="page">
            <Dialogs username={username} image={image} />
            <Outlet context={{ userId }} />
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
