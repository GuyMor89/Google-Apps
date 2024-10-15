import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailFilter({ filterBy, changeFilterBy }) {

    const [currentCategory, setCurrentCategory] = useState('inbox')
    const [unreadPageNumbers, setUnreadPageNumbers] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)
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

    useEffect(() => {
        setTimeout(() => {
            calculateUnreadNumbers()
        }, 250);
    }, [location])

    function handleSideFilterClasses(category) {
        let categoryClass = 'filter-icon-nav-category'
        if (currentCategory === category) categoryClass += ' chosen'
        if (menuOpen) categoryClass += ' expanded'
        return categoryClass
    }

    function calculateUnreadNumbers() {
        mailService.query()
            .then(({ mails }) => {
                const amountOfUnreadPrimaryMails = mails.filter(mail => mail.isPrimary && !mail.isRead).length
                const amountOfDrafts = mails.filter(mail => mail.sentAt === null).length

                setUnreadPageNumbers({ amountOfUnreadPrimaryMails, amountOfDrafts })
            })
    }

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
                <article className="filter-icon-nav">
                    <i className="fa-solid fa-bars" onClick={() => setMenuOpen(!menuOpen)}></i>
                    <div className={`${handleSideFilterClasses('compose')} compose`} onClick={() => setSearchParams({ compose: '' })} id="Compose">
                        <i className="fa-solid fa-pencil"></i>
                        {menuOpen && <h3>Compose</h3>}
                    </div>
                    <div className={handleSideFilterClasses('inbox')} onClick={() => { setCurrentCategory('inbox'), navigate('/mail/inbox') }} title="Inbox">
                        <i className="fa-solid fa-inbox"></i>
                        {menuOpen &&
                            <React.Fragment>
                                <h3 className={unreadPageNumbers && unreadPageNumbers.amountOfUnreadPrimaryMails > 0 ? 'bold' : ''}>Inbox</h3>
                                <span className={unreadPageNumbers && unreadPageNumbers.amountOfUnreadPrimaryMails > 0 ? 'bold' : ''}>{unreadPageNumbers && unreadPageNumbers.amountOfUnreadPrimaryMails ? unreadPageNumbers && unreadPageNumbers.amountOfUnreadPrimaryMails : ''}</span>
                            </React.Fragment>}
                    </div>
                    <div className={handleSideFilterClasses('starred')} onClick={() => { setCurrentCategory('starred'), navigate('/mail/starred') }} title="Starred">
                        <i className={currentCategory === 'starred' ? "fa-solid fa-star gold" : "fa-regular fa-star"}></i>
                        {menuOpen &&
                            <React.Fragment>
                                <h3>Starred</h3>
                                <span></span>
                            </React.Fragment>}
                    </div>
                    <div className={handleSideFilterClasses('sent')} onClick={() => { setCurrentCategory('sent'), navigate('/mail/sent') }} title="Sent">
                        <i className={currentCategory === 'sent' ? "fa-solid fa-paper-plane" : "fa-regular fa-paper-plane"}></i>
                        {menuOpen &&
                            <React.Fragment>
                                <h3>Sent</h3>
                                <span></span>
                            </React.Fragment>}
                    </div>
                    <div className={handleSideFilterClasses('draft')} onClick={() => { setCurrentCategory('draft'), navigate('/mail/draft') }} title="Drafts">
                        <i className={currentCategory === 'draft' ? "fa-solid fa-file" : "fa-regular fa-file"}></i>
                        {menuOpen &&
                            <React.Fragment>
                                <h3 className={unreadPageNumbers && unreadPageNumbers.amountOfDrafts > 0 ? 'bold' : ''}>Drafts</h3>
                                <span className={unreadPageNumbers && unreadPageNumbers.amountOfDrafts > 0 ? 'bold' : ''}>{unreadPageNumbers && unreadPageNumbers.amountOfDrafts > 0 ? unreadPageNumbers && unreadPageNumbers.amountOfDrafts : ''}</span>
                            </React.Fragment>}
                    </div>
                    <div className={handleSideFilterClasses('trash')} onClick={() => { setCurrentCategory('trash'), navigate('/mail/trash') }} title="Trash">
                        <i className={currentCategory === 'trash' ? "fa-solid fa-trash-can" : "fa-regular fa-trash-can"}></i>
                        {menuOpen &&
                            <React.Fragment>
                                <h3>Trash</h3>
                                <span></span>
                            </React.Fragment>}
                    </div>
                    <div className={handleSideFilterClasses('all')} onClick={() => { setCurrentCategory('all'), navigate('/mail/all') }} title="All Mail">
                        <i className={currentCategory === 'all' ? "fa-solid fa-envelope" : "fa-regular fa-envelope"}></i>
                        {menuOpen &&
                            <React.Fragment>
                                <h3>All Mail</h3>
                                <span></span>
                            </React.Fragment>}
                    </div>
                </article>
            </section>
        </React.Fragment>
    )
}