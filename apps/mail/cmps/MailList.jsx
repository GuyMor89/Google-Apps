import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

import { MailPreview } from "../cmps/MailPreview.jsx"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailList({ mails, filterBy, setFilterBy, amountOfMails }) {

    const [noMailType, setNoMailType] = useState(null)
    const [lastAction, setLastAction] = useState(Date.now())
    const [isChecked, setIsChecked] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
    }, [params.category])

    useEffect(() => {
        if (params.category === 'starred') setNoMailType('starred')
        else if (params.category === 'sent') setNoMailType('sent')
        else if (params.category === 'draft') setNoMailType('draft')
        else if (params.category === 'trash') setNoMailType('trash')
        else setNoMailType('inbox')
        setIsLoading(false)
    }, [mails])

    function noMailMessage() {
        if (noMailType === 'inbox') return <React.Fragment><div className="no-mails-title">Your Primary tab is empty.</div></React.Fragment>
        if (noMailType === 'starred') return <React.Fragment><div className="no-mails-title">No starred messages.</div> <div className="no-mails-subject">Stars let you give messages a special status to make them easier to find. </div> <div className="no-mails-body">To star a message, click on the star outline beside any message or conversation.</div></React.Fragment>
        if (noMailType === 'sent') return <React.Fragment><div className="no-mails-title">No sent messages. Send a message today!</div></React.Fragment>
        if (noMailType === 'draft') return <React.Fragment><div className="no-mails-title">You don't have any saved drafts.</div><div className="no-mails-subject">Saving a draft allows you to keep a message you aren't ready to send yet.</div></React.Fragment>
        if (noMailType === 'trash') return <React.Fragment><div className="no-mails-title">No conversations in Trash. </div> <div className="no-mails-subject">Messages that have been in Trash more than 30 days will be automatically deleted.</div></React.Fragment>
    }

    function getMailNumbers() {
        if (filterBy.page.currentPage === 0) return <span>1 - 15 of {amountOfMails}</span>
        if (filterBy.page.currentPage === 1) return <span>16 - {amountOfMails} of {amountOfMails}</span>
    }

    const thereAreMails = mails.length !== 0

    if (isLoading) return <div className="progress" />

    const { page } = filterBy
    let { currentPage } = page

    return (
        <article className="mail-list">
            <div className="mail-list-nav">
                <div className="mail-list-buttons">
                    <i onClick={() => setIsChecked(!isChecked)} className={isChecked ? "fa-regular fa-square-check" : "fa-regular fa-square"} title="Select All"></i>
                    <i onClick={() => window.location.reload()} className="fa-solid fa-rotate-right" title="Refresh"></i>
                    <i className="fa-regular fa-envelope-open" title="Mark as Read"></i>
                </div>
                <div className="mail-list-counter">
                    {getMailNumbers()}
                    <i className="fa-solid fa-angle-left" onClick={() => setFilterBy({ ...filterBy, page: { ...filterBy.page, currentPage: currentPage - 1 } })}></i>
                    <i className="fa-solid fa-angle-right" onClick={() => setFilterBy({ ...filterBy, page: { ...filterBy.page, currentPage: currentPage + 1 } })}></i>
                </div>
            </div>
            {thereAreMails
                ?
                mails.map(mail =>
                    <MailPreview key={mail.id} mail={mail} />)
                :
                noMailMessage()
            }
            <div className="mail-list-footer">
                <div className="data-usage">
                    <div className="data-usage-bar"></div>
                    <div className="data-usage-stats">0.01GB of 15GB used</div>
                </div>
                <div className="last-activity">Last Account Activity: {utilService.formatDate(lastAction)}</div>
            </div>
        </article>
    )
}
