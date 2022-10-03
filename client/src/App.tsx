import React from 'react';
import { HashRouter, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dialogs from './components/dialogs';
import Messages from './components/messages';
import './styles/page.scss';

const Page = () => {
    return (
        <div className="page">
            <Dialogs />
            <Messages />
        </div>
    );
};

function App() {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            {/* <HashRouter basename="/"> */}
            <Routes>
                <Route path="/:id" element={<Page />} />
                <Route
                    path="*"
                    element={<Navigate to={`/f${(+new Date()).toString(16)}`} replace />}
                />
            </Routes>
            {/* </HashRouter> */}
        </BrowserRouter>
    );
}

export default App;
