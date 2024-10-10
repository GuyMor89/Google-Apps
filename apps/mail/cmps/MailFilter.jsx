import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailFilter({ filterBy, changeFilterBy }) {

    const [currentCategory, setCurrentCategory] = useState('inbox')
    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    useEffect(() => {
        if (params.category === 'starred') setCurrentCategory('starred')
        else if (params.category === 'sent') setCurrentCategory('sent')
        else if (params.category === 'draft') setCurrentCategory('draft')
        else if (params.category === 'trash') setCurrentCategory('trash')
        else if (params.category === 'all') setCurrentCategory('all')
        else setCurrentCategory('inbox')
    }, [params])

    return (
        <React.Fragment>
            <section className="mail-header">
                <div className="logo" onClick={() => navigate('/mail/')}>
                    <img src="./assets/img/gmail.png"></img>
                </div>
                <article className="search-input">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input onChange={(ev) => changeFilterBy(ev)} type="search" defaultValue={filterBy.text} placeholder="Search mail" />
                </article>
            </section>
            <section className="side-filter">
                <article className="icon-nav">
                    <i className="fa-solid fa-bars"></i>
                    <i className="fa-solid fa-pencil" onClick={() => setSearchParams({ compose: '' })}></i>
                    <i className={currentCategory === 'inbox' ? "fa-solid fa-inbox chosen" : "fa-solid fa-inbox"} onClick={() => { setCurrentCategory('inbox'), navigate('/mail/inbox') }} title="Inbox"></i>
                    <i className={currentCategory === 'starred' ? "fa-solid fa-star gold chosen" : "fa-regular fa-star"} onClick={() => { setCurrentCategory('starred'), navigate('/mail/starred') }} title="Starred"></i>
                    <i className={currentCategory === 'sent' ? "fa-solid fa-paper-plane chosen" : "fa-regular fa-paper-plane"} onClick={() => { setCurrentCategory('sent'), navigate('/mail/sent') }} title="Sent"></i>
                    <i className={currentCategory === 'draft' ? "fa-solid fa-file chosen" : "fa-regular fa-file"} onClick={() => { setCurrentCategory('draft'), navigate('/mail/draft') }} title="Drafts"></i>
                    <i className={currentCategory === 'trash' ? "fa-solid fa-trash-can chosen" : "fa-regular fa-trash-can"} onClick={() => { setCurrentCategory('trash'), navigate('/mail/trash') }} title="Trash"></i>
                    <i className={currentCategory === 'all' ? "fa-solid fa-envelope chosen" : "fa-regular fa-envelope"} onClick={() => { setCurrentCategory('all'), navigate('/mail/all') }} title="All Mail"></i>
                </article>
            </section>
        </React.Fragment>
    )
}