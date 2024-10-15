import { bookService } from "../services/book.service.js"
import { utilService } from "../services/util.service.js"


export function AddReview({ book, setBook, setIsAdding }) {

    function addReview(event) {
        event.preventDefault()

        const formData = new FormData(event.target)
        const review = {
            id: utilService.makeId(),
            name: formData.get('full-name'),
            rating: formData.get('rating'),
            readAt: formData.get('read-at'),
            review: formData.get('review-text')
        }

        const reviews = book.reviews || []
        reviews.push(review)
        const editedBook = { ...book, reviews }
        bookService.save(editedBook)
            .then(result => setBook(result))
    }

    return (
        <article className="add-review-container">
            <form className="add-review" onSubmit={(event) => {
                addReview(event)
                setIsAdding(false)
            }}>
                {/* <h2>Add Review</h2> */}
                <label htmlFor="full-name">Full Name</label>
                <input type="text" name="full-name" id="full-name" />
                <label htmlFor="rating">Rating</label>
                <input list="options" name="rating" id="rating" />
                <datalist id="options">
                    <option value="1" />
                    <option value="2" />
                    <option value="3" />
                    <option value="4" />
                    <option value="5" />
                </datalist>
                <label htmlFor="read-at">Read At</label>
                <input type="date" name="read-at" id="read-at" />
                <label htmlFor="review-text">Review</label>
                <textarea rows="3" name="review-text" id="review-text"></textarea>
                <button>Submit</button>
            </form>
        </article>
    )
}