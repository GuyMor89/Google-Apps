import { Home } from './cmps/Home.jsx'
import { BookIndex } from './cmps/BookIndex.jsx'
import { BookDetails } from './cmps/BookDetails.jsx'
import { BookEdit } from './cmps/BookEdit.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { NotFound } from './cmps/NotFound.jsx'
import { BookAdd } from './cmps/BookAdd.jsx'
import { BookReviews } from './cmps/BookReviews.jsx'

const Router = ReactRouterDOM.HashRouter
const { Routes, Route, Navigate, Link, NavLink } = ReactRouterDOM

export function App() {

    return (
        <Router>
            <section className="app">
                <header className="app-header">
                    <h1>Miss Books</h1>
                    <article className='nav-bar'>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/books">Book Index</NavLink>
                    </article>
                </header>
                <main className="container">
                    <Routes>
                        <Route path="/" element={<Navigate to="/books" />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/books" element={<BookIndex />}>
                            <Route path="/books/add/:searchText" element={<BookAdd />} />
                        </Route>
                        <Route path="/books/:bookID" element={<BookDetails />}>
                            <Route path="reviews" element={<BookReviews />} />
                        </Route>
                        <Route path="/books/edit/:bookID" element={<BookEdit />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <UserMsg />
                </main>
                <footer>
                    <div></div>
                    <div>
                        <div>
                            <span>Copyright</span>
                            <span><i className="fa-regular fa-copyright"></i></span>
                        </div>
                        <span>2024</span>
                        <span data-i18n="footerBy">by Guy Mor</span>
                    </div>
                    <a></a>
                </footer>
            </section>
        </Router>
    )
}