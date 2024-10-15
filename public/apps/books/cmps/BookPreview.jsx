const { useNavigate } = ReactRouterDOM

export function BookPreview({ book }) {

    const navigate = useNavigate()

    function navigateToBook() {
        navigate(`/books/${book.id}`)
    }

    const {title, thumbnail, id} = book

    return (
        <div className="book-preview" id={id} onClick={navigateToBook}>
            <h3><span>{title}</span></h3>
            <img src={thumbnail}></img>
        </div>
    )
}