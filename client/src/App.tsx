import React from 'react';
import { HashRouter, BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dialogs from './components/dialogs';
import Welcome from './components/Welcome';
import Error from './components/Error';
import Messages from './components/messages';
import './styles/page.scss';

const Page = () => {
    return (
        <div className="page">
            <Dialogs />
            <Outlet />
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
