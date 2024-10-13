import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"
import { MailReply } from "../cmps/MailReply.jsx"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailDetails({ mailID }) {

    const [mail, setMail] = useState(null)
    const [currentAction, setCurrentAction] = useState({ isReplying: false, isForwarding: false })
    const [isLoading, setIsLoading] = useState({ first: false, second: true })

    const topRef = useRef(null)
    const { isReplying, isForwarding } = currentAction

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        mailService.get(mailID)
            .then(result => {
                setMail(result)
                setIsLoading({ first: false, second: false })
            })
    }, [])

    useEffect(() => {
        if (!isLoading && topRef.current) topRef.current.focus()
    }, [isLoading])

    function moveToTrash() {
        setIsLoading({ ...isLoading, first: true })
        showSuccessMsg('E-Mail Moved to Trash')
        mailService.save({ ...mail, removedAt: Date.now() })
            .then(() => {
                navigate(`/mail/${params.category}`)
            })
    }

    function moveToInbox() {
        setIsLoading({ ...isLoading, first: true })
        showSuccessMsg('E-Mail Moved to Inbox')
        mailService.save({ ...mail, removedAt: null })
            .then(() => {
                navigate(`/mail/${params.category}`)
            })
    }

    function handleUnread() {
        setIsLoading({ ...isLoading, first: true })
        showSuccessMsg('E-Mail Marked as Unread')
        mailService.save({ ...mail, isRead: false })
            .then(() => {
                navigate(`/mail/${params.category}`)
            })
    }

    function handleReplyOrForwardRouting(type) {
        setCurrentAction({ isReplying: false, isForwarding: false })
        setTimeout(() => {
            type === 'reply' ?
            setCurrentAction({ isReplying: true, isForwarding: false })
            :
            setCurrentAction({ isReplying: false, isForwarding: true })    
        }, 0);  
    }

    if (isLoading.first) return <div className="progress" />
    if (isLoading.second) return <div className="progress2" />

    const { id, createdAt, subject, body, isRead, isStarred, sentAt, removedAt, from, to } = mail
    const { shortDate, shortHour, formattedDate, relativeTime } = utilService.formatDate(sentAt)
    
    return (
        <section className="mail-details">
            <article className="mail-details-nav-container">
                <div className="mail-details-nav">
                    <i onClick={() => navigate(`/mail/${params.category}`)} ref={topRef} tabIndex="0" className="fa-solid fa-arrow-left" aria-hidden={false}></i>
                    <i className="fa-regular fa-folder-closed"></i>
                    <i onClick={params.category === 'trash' ? moveToInbox : moveToTrash} className={params.category === 'trash' ? "fa-solid fa-trash-can-arrow-up" : "fa-regular fa-trash-can"}></i>
                    <i onClick={handleUnread} className="fa-solid fa-envelope-circle-check" title="Mark Unread"></i>
                </div>
            </article>
            <article className="mail-details-content">
                <div className="mail-details-subject">{subject}</div>
                <div className="user-image">
                    <img src="./assets/img/user.png"></img>
                </div>
                <div className="mail-details-from">{from}</div>
                <div className="mail-details-to">to: {to}</div>
                <div className="mail-details-time">{formattedDate} ({relativeTime})</div>
                <pre className="mail-details-body">{body}</pre>
            </article>
            {mail.replies && mail.replies.map(reply => {
                return <article key={reply.createdAt} className="mail-reply-content">
                    <div className="user-image">
                        <img src="./assets/img/user.png"></img>
                    </div>
                    <div className="mail-details-from">{reply.from}</div>
                    <div className="mail-details-to">to: {reply.to}</div>
                    <div className="mail-details-time">{utilService.formatDate(reply.sentAt).formattedDate} {utilService.formatDate(reply.sentAt).relativeTime}</div>
                    <pre className="mail-details-body">{reply.body}</pre>
                </article>
            })}
            <div className="mail-details-buttons">
                <button onClick={() => handleReplyOrForwardRouting('reply')} className="mail-reply-button"><i className="fa-solid fa-reply"></i>Reply</button>
                <button onClick={() => handleReplyOrForwardRouting('foward')} className="mail-forward-button"><i className="fa-solid fa-share"></i>Forward</button>
            </div>
            <MailReply mail={mail} currentAction={currentAction} setCurrentAction={setCurrentAction} />
        </section>
    )
}