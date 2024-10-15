import { bookService } from "../services/book.service.js"
import { Loader } from "./Loader.jsx"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

export function BookAdd() {

    const [foundBooks, setFoundBooks] = useState(null)
    const [booksToDisplay, setBooksToDisplay] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        searchForBooks()
    }, [params.searchText])

    console.log(foundBooks)

    function searchForBooks() {
        setIsLoading(true)

        const API_PREFIX = 'https://openlibrary.org/search.json?q='
        const API_URL = `${API_PREFIX}${params.searchText}`

        fetch(API_URL)
            .then(result => result.json())
            .then(result => {
                if (result.numFound === 0) {
                    showErrorMsg('Cannot find book..')
                    navigate('/books')
                }
                const firstTenBooks = result.docs.slice(0, 10)
                const parsedBooks = firstTenBooks.map(({ title, author_name }) => ({ title, author: author_name[0] }))
                setFoundBooks(firstTenBooks)
                setBooksToDisplay(parsedBooks)
                setIsLoading(false)
            })
            .catch(error => {
                console.error(error)
                showErrorMsg('Cannot find book..')
                navigate('/books')
            })
    }

    function addBook(chosenTitle) {
        setIsLoading(true)

        const chosenBook = foundBooks.find(book => book.title === chosenTitle)
        const bookTemplate = { id: "", title: "", subtitle: "", authors: "", publishedDate: 0, description: "", pageCount: 0, categories: "", thumbnail: "", language: "en", listPrice: { amount: 0, currencyCode: "USD", isOnSale: false } }

        const { title, author_name, first_publish_year, number_of_pages_median, cover_i } = chosenBook
        const data = { title, authors: author_name, publishedDate: first_publish_year, pageCount: number_of_pages_median, coverID: cover_i }
        const imgURL = { thumbnail: `https://covers.openlibrary.org/b/id/${data.coverID}-L.jpg` }

        const newBook = { ...bookTemplate, ...data, ...imgURL }
        bookService.save(newBook)
            .then(result => {
                showSuccessMsg('Book added!')
                navigate(`/books/${result.id}`)
            })
    }

    if (isLoading) return <Loader />

    return (
        <article className="book-add">
            <h2>Search Results</h2>
            {booksToDisplay && booksToDisplay.map(({ title, author }, idx) =>
                <div key={idx}>
                    <h2>{title} <span>by {author}</span></h2>
                    <button onClick={() => addBook(title)}>Add Book</button>
                </div>
            )}
            <button onClick={() => navigate('/books')}>Back</button>
        </article>
    )
}