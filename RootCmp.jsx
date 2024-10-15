const { useState, useEffect, useRef } = React

const { Route, Routes, Navigate } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from "./cmps/AppHeader.jsx"
import { About } from "./pages/About.jsx"
import { Home } from "./pages/Home.jsx"
import { MailIndex } from "./apps/mail/pages/MailIndex.jsx"
import { UserMsg } from "./cmps/UserMsg.jsx"

import { BookIndex } from "./apps/books/cmps/BookIndex.jsx"

export function App() {

    return <Router>
        <section className="app">
            <AppHeader />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mail" element={<Navigate to="/mail/inbox" />} />
                <Route path="/mail/:category" element={<MailIndex />} />
                <Route path="/mail/:category/:mailID" element={<MailIndex />} />
                <Route path="/books" element={<RedirectToMissBooks />} />
                <Route path="/wikitube" element={<RedirectToWikitube />} />
            </Routes>
            <UserMsg />
        </section>
    </Router>
}

function RedirectToWikitube() {
    return <div>
        <iframe
            src="./apps/wikitube/index.html"
            style={{ width: '100%', height: '100vh', border: 'none' }}
        ></iframe>
    </div>
}

function RedirectToMissBooks() {
    return <div>
        <iframe
            src="./apps/books/index.html"
            style={{ width: '100%', height: '100vh', border: 'none' }}
            title="Static Page"
        ></iframe>
    </div>
}