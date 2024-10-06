import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailDetails({ mailID }) {

    const [mail, setMail] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoading2, setIsLoading2] = useState(false)

    const topRef = useRef(null)

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        mailService.get(mailID)
            .then(result => {
                setMail(result)
                setIsLoading(false)
                setIsLoading2(false)
            })
    }, [])

    useEffect(() => {
        if (!isLoading && topRef.current) topRef.current.focus()
    }, [isLoading])

    function parseBody(body) {
        return body
            .split('\n')
            .map((line, idx) => {
                if (line.trim() === '') return <br key={idx} />
                return (
                    <p key={idx}>
                        {line.trim()}
                        {idx < body.split('\n').length - 1 && <br />}
                    </p>
                )
            })
    }

    function moveToTrash() {
        setIsLoading2(true)
        showSuccessMsg('E-Mail Moved to Trash')
        mailService.save({ ...mail, removedAt: Date.now() })
            .then(() => {
                navigate(`/mail/${params.category}`)
            })
    }

    function handleUnread() {
        setIsLoading2(true)
        showSuccessMsg('E-Mail Marked as Unread')
        mailService.save({ ...mail, isRead: false })
            .then(() => {
                navigate(`/mail/${params.category}`)
            })
    }

    if (isLoading) return <div className="progress2" />
    if (isLoading2) return <div className="progress" />

    const { id, createdAt, subject, body, isRead, isStarred, sentAt, removedAt, from, to } = mail

    return (
        <section className="mail-details">
            <article className="mail-icon-nav-container">
                <div className="mail-icon-nav">
                    <i onClick={() => navigate(`/mail/${params.category}`)} ref={topRef} tabIndex="0" className="fa-solid fa-arrow-left" aria-hidden={false}></i>
                    <i className="fa-regular fa-folder-closed"></i>
                    <i onClick={moveToTrash} className="fa-regular fa-trash-can"></i>
                    <i onClick={handleUnread} className="fa-solid fa-envelope-circle-check" title="Mark Unread"></i>
                </div>
            </article>
            <article className="mail-details-content">
                <div className="mail-details-subject">{subject}</div>
                <div className="user-image">
                    <img src="../../../assets/img/user.png"></img>
                </div>
                <div className="mail-details-from">{from}</div>
                <div className="mail-details-time">{utilService.formatDate(sentAt)}</div>
                <div className="mail-details-body">{parseBody(body)}</div>
                <div className="mail-details-buttons">
                    <button className="mail-reply"><i className="fa-solid fa-reply"></i>Reply</button>
                    <button className="mail-forward"><i className="fa-solid fa-share"></i>Forward</button>
                </div>
            </article>
        </section>
    )
}