import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailPreview({ mail }) {

    const [starred, setStarred] = useState(mail.isStarred)
    const [isChecked, setIsChecked] = useState(null)
    const hasMounted = useRef(false)

    const navigate = useNavigate()

    const { id, createdAt, subject, body, isRead, isStarred, sentAt, removedAt, from, to } = mail

    useEffect(() => {

    }, [isChecked])

    useEffect(() => {
        if (hasMounted.current) editMail('starred')
        else hasMounted.current = true
    }, [starred])

    function handleIconClicks(event) {
        event.stopPropagation()
        setStarred(!starred)
    }

    function editMail(type) {
        if (type === 'read') return mailService.save({ ...mail, isStarred: starred, isRead: true })
        if (type === 'starred') return mailService.save({ ...mail, isStarred: !isStarred })
    }

    return (
        <div className={isRead ? 'mail-preview read' : 'mail-preview'} onClick={() => { editMail('read'), navigate(`/mail/inbox/${mail.id}`) }}>
            <i onClick={() => setIsChecked(!isChecked)} className={isChecked ? "fa-regular fa-square-check" : "fa-regular fa-square faint"}></i>
            <i onClick={handleIconClicks} className={starred ? "fa-solid fa-star gold" : "fa-regular fa-star faint"}></i>
            <h3 className={isRead ? 'read' : ''}>{from}</h3>
            <h4 className={isRead ? 'read' : ''}>{subject} - <span>{body}</span></h4>
        </div>
    )
}