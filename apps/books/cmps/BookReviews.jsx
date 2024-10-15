import { AddReview } from "./AddReview.jsx"
import { bookService } from "../services/book.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Outlet, useOutletContext } = ReactRouterDOM

export function BookReviews() {

    const {book, setBook} = useOutletContext()
    const [isAdding, setIsAdding] = useState(false)

    function removeReview(bookID, reviewID) {
        bookService.get(bookID)
            .then(result => {
                const newReviews = result.reviews.filter(review => review.id !== reviewID)
                const newBook = { ...result, reviews: newReviews }
                return bookService.save(newBook)
            })
            .then(result => setBook(result))
    }

    function StarRating({ rating }) {
        return (
            <span>
                {Array.from({ length: +rating }, (_, index) => (
                    <i key={index} className="fa-solid fa-star"></i>
                ))}
            </span>
        )
    }

    return (
        <div className="book-review-container">
            <button onClick={() => setIsAdding(true)}>Add Review</button>
            {isAdding && <AddReview book={book} setBook={setBook} setIsAdding={setIsAdding} />}
            <h2>Reviews</h2>
            {(!book.reviews || (book.reviews.length === 0)) && !isAdding && <h3>No Reviews..</h3>}
            {book.reviews && book.reviews.map(({ id, name, rating, readAt, review }) => {
                return <div key={id} className="book-review">
                    <button onClick={() => removeReview(book.id, id)}>X</button>
                    <h3>Name</h3><span>{name}</span>
                    <h4>Rating</h4><StarRating rating={rating} />
                    <h5>Read At</h5><span>{readAt}</span>
                    <h4>Review</h4><span>{review}</span>
                </div>
            })}
        </div>
    )
}