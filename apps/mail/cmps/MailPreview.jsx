import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailPreview({ mail }) {

    const [starred, setStarred] = useState(mail.isStarred)
    const [isChecked, setIsChecked] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const hasMounted = useRef(false)
    const navigate = useNavigate()
    const params = useParams()

    const { id, createdAt, subject, body, isRead, isStarred, sentAt, removedAt, from, to } = mail
    const { shortDate, shortHour, formattedDate, relativeTime } = utilService.formatDate(sentAt)
    const todayDate = utilService.formatDate(Date.now()).shortDate 

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
        <div className={isRead ? 'mail-preview read' : 'mail-preview'} onClick={() => { params.category === 'draft' ? setSearchParams({ compose: mail.id }) : (editMail('read'), navigate(`/mail/${params.category}/${mail.id}`)) }}>
            <i onClick={() => setIsChecked(!isChecked)} className={isChecked ? "fa-regular fa-square-check" : "fa-regular fa-square faint"}></i>
            <i onClick={handleIconClicks} className={starred ? "fa-solid fa-star gold" : "fa-regular fa-star faint"}></i>
            <h3 className={isRead ? 'read' : ''}>{from === 'user@gmail.com' ? 'me' : from}</h3>
            <h4 className={isRead ? 'read' : ''}>{subject} - <span>{body}</span></h4>
            <h3>{shortDate === todayDate ? shortHour :shortDate}</h3>
        </div>
    )
}