const { Route, Routes, Navigate } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from "./cmps/AppHeader.jsx"
import { About } from "./pages/About.jsx"
import { Home } from "./pages/Home.jsx"
import { MailIndex } from "./apps/mail/pages/MailIndex.jsx"

import { NoteIndex } from "./apps/note/pages/NoteIndex.jsx"

export function App() {
    return <Router>
        <section className="app">
            {/* <AppHeader /> */}
            <Routes>
                <Route path="/" element={<Navigate to="/mail" />} />
                <Route path="/about" element={<About />} />
                <Route path="/mail" element={<Navigate to="/mail/inbox" />} />
                <Route path="/mail/:category" element={<MailIndex />} />
                <Route path="/mail/inbox/:mailID" element={<MailIndex />} />
                <Route path="/note" element={<NoteIndex />} />
            </Routes>
        </section>
    </Router>
}
