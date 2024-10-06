import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailFilter({ filterBy, changeFilterBy }) {

    const [currentCategory, setCurrentCategory] = useState('inbox')

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname === '/mail/starred') setCurrentCategory('starred')
        else if (location.pathname === '/mail/trash') setCurrentCategory('trash')
        else if (location.pathname === '/mail/sent') setCurrentCategory('sent')
        else setCurrentCategory('inbox')
    }, [location])

    return (
        <React.Fragment>
            <section className="mail-header">
                <div className="logo" onClick={() => navigate('/mail/')}>
                    <img src="../../../assets/img/gmail.png"></img>
                </div>
                <article className="search-input">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input onChange={(ev) => changeFilterBy(ev)} type="search" defaultValue={filterBy.text} placeholder="Search mail" />
                </article>
            </section>
            <section className="side-filter">
                <article className="icon-nav">
                    <i className="fa-solid fa-bars"></i>
                    <i className="fa-solid fa-pencil"></i>
                    <i className={currentCategory === 'inbox' ? "fa-solid fa-inbox blue chosen" : "fa-solid fa-inbox "} onClick={() => { setCurrentCategory('inbox'), navigate('/mail/inbox') }} title="Inbox"></i>
                    <i className={currentCategory === 'starred' ? "fa-solid fa-star gold chosen" : "fa-regular fa-star"} onClick={() => { setCurrentCategory('starred'), navigate('/mail/starred') }} title="Starred"></i>
                    <i className={currentCategory === 'sent' ? "fa-solid fa-paper-plane blue chosen" : "fa-regular fa-paper-plane"} onClick={() => { setCurrentCategory('sent'), navigate('/mail/sent') }} title="Sent"></i>
                    <i className="fa-regular fa-file" title="Drafts"></i>
                    <i className={currentCategory === 'trash' ? "fa-solid fa-trash-can blue chosen" : "fa-regular fa-trash-can"} onClick={() => { setCurrentCategory('trash'), navigate('/mail/trash') }} title="Trash"></i>
                    <i className="fa-regular fa-envelope" title="All Mail"></i>
                </article>
            </section>
        </React.Fragment>
    )
}