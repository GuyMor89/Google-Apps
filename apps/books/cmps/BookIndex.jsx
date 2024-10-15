import { bookService } from "../services/book.service.js"
import { utilService } from "../services/util.service.js"

import { BookList } from './BookList.jsx'
import { BookFilter } from "./BookFilter.jsx"
import { Loader } from "./Loader.jsx"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams } = ReactRouterDOM

export function BookIndex() {

    const [books, setBooks] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(bookService.getFilterFromSearchParams(searchParams))
    const [isLoading, setIsLoading] = useState(true)

    const location = useLocation()

    const isRootPath = location.pathname === '/books'
    const debounceFilters = useRef(utilService.debounce(setFilterBy, 1000))

    useEffect(() => {
        setSearchParams(bookService.cleanFilter(filterBy)) //Set only the searchParams that have been changed
        loadBooks()
    }, [filterBy])

    useEffect(() => {
       if (searchParams.size === 0) changeFilterBy(undefined, 'reset') //Reset the filterBy when the URL changes
    }, [searchParams])

    useEffect(() => {
        // if (books && books.length === 0 && filterBy.text !== '') navigate(`/books/add/${filterBy.text}`)
    }, [books])

    function loadBooks() {
        return bookService.query(filterBy)
            .then(setBooks)
            .then(() => setIsLoading(false))
    }

    function changeFilterBy(ev, reset) {
        if (reset) return setFilterBy({ text: '', price: '' })

        const input = ev.target.value
        let newFilterBy

        if (ev.nativeEvent.inputType) {
            const text = input
            newFilterBy = { ...filterBy, text }
            debounceFilters.current(newFilterBy)
        } else {
            const price = input
            newFilterBy = { ...filterBy, price }
            setFilterBy(newFilterBy)
        }
    }
    if (isLoading) return (
        <React.Fragment>
            <BookFilter changeFilterBy={changeFilterBy} filterBy={filterBy} />
            <Loader />
        </React.Fragment>
    )
    return (
        <section className="book-index">
            <BookFilter changeFilterBy={changeFilterBy} filterBy={filterBy} />
            {isRootPath ? (<BookList books={books} filterBy={filterBy} />) : (<Outlet />)}
        </section>
    )
}