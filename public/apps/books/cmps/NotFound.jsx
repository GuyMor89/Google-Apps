const { Link, useNavigate } = ReactRouterDOM

export function NotFound() {

    const navigate = useNavigate()

    return (
        <section className="not-found-container">

            <div className="not-found">
                <h2>Page Not Found</h2>
                <button onClick={() => navigate('/books')}>Back to Book List</button>
            </div>
        </section>

    )
}