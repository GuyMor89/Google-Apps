import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"
import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailPreview({ mail, checkedMailIDs, setCheckedMailIDs, unreadAllCheckedMails }) {

    const [starred, setStarred] = useState(mail.isStarred)
    const [checked, setChecked] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState({ first: false, second: false })

    const hasMounted = useRef(false)
    const navigate = useNavigate()
    const params = useParams()

    const { id, name, createdAt, subject, body, isRead, isStarred, isArchived, sentAt, removedAt, from, to } = mail

    useEffect(() => {
        if (checkedMailIDs.find(checkedIDs => checkedIDs === mail.id)) setChecked(true)
        else if (checkedMailIDs.length === 0) setChecked(false)
    }, [checkedMailIDs])

    useEffect(() => {
        if (hasMounted.current) editMail('starred')
        else hasMounted.current = true
    }, [starred])

    function handleStarClick(event) {
        event.stopPropagation()
        setStarred(!starred)
    }

    function editMail(type) {
        if (type === 'read') return mailService.save({ ...mail, isStarred: starred, isRead: true })
        if (type === 'starred') return mailService.save({ ...mail, isStarred: !isStarred })
    }

    function addCheckedIDs(event) {
        event.stopPropagation()
        setChecked(!checked)

        if (checkedMailIDs.includes(mail.id)) {
            const newCheckedMailIDs = checkedMailIDs.filter(id => id !== mail.id)
            setCheckedMailIDs(newCheckedMailIDs)
        }
        else setCheckedMailIDs(prevIDs => [...prevIDs, mail.id])
    }

    function handleDateFormatting() {
        const todayDate = utilService.formatDate(Date.now()).shortDate
        const currentYear = utilService.formatDate(Date.now()).shortYear

        if (params.category === 'draft') {
            const { shortDate, shortHour, mediumDate, shortYear } = utilService.formatDate(createdAt)
            if (shortYear === currentYear) {
                return shortDate === todayDate ? shortHour : shortDate
            }
            else return mediumDate
        }
        else {
            const { shortDate, shortHour, mediumDate, shortYear } = utilService.formatDate(sentAt)
            if (shortYear === currentYear) {
                return shortDate === todayDate ? shortHour : shortDate
            }
            else return mediumDate
        }
    }

    function handleArchive(event) {
        event.stopPropagation()

        if (mail.isArchived) {
            showSuccessMsg('Mail Archived')
            mailService.save({ ...mail, isArchived: false })
                .then(() => {
                    unreadAllCheckedMails([])
                })
        } else if (!mail.isArchived) {
            showSuccessMsg('Mail Removed from Archive')
            mailService.save({ ...mail, isArchived: true })
                .then(() => {
                    unreadAllCheckedMails([])
                })
        }
    }

    function handleUnread(event) {
        event.stopPropagation()

        if (mail.isRead) {
            showSuccessMsg('Mail Marked as Unread')
            mailService.save({ ...mail, isRead: false })
                .then(() => {
                    unreadAllCheckedMails([])
                })
        } else if (!mail.isRead) {
            showSuccessMsg('Mail Marked as Read')
            mailService.save({ ...mail, isRead: true })
                .then(() => {
                    unreadAllCheckedMails([])
                })
        }
    }

    function moveToTrash(event) {
        event.stopPropagation()

        showSuccessMsg('Mail Moved to Trash')
        mailService.save({ ...mail, removedAt: Date.now() })
            .then(() => {
                unreadAllCheckedMails([])
            })
    }

    return (
        <div className={`mail-preview ${isRead ? 'mail-preview read' : 'mail-preview'} ${checked ? 'checked' : ''}`} onClick={() => { params.category === 'draft' ? setSearchParams({ compose: mail.id }) : (editMail('read'), navigate(`/mail/${params.category}/${mail.id}`)) }}>
            <i onClick={addCheckedIDs} className={checked ? "fa-regular fa-square-check" : "fa-regular fa-square faint"}></i>
            <i onClick={handleStarClick} className={starred ? "fa-solid fa-star gold" : "fa-regular fa-star faint"}></i>
            <h3 className={`${isRead ? 'read' : ''} ${checked ? 'checked' : ''}`}>{params.category === 'sent' ? `To: ${to}` : name}</h3>
            <h4 className={`${isRead ? 'read' : ''} ${checked ? 'checked' : ''}`}>{subject} - <span>{body}</span></h4>
            <h3>{handleDateFormatting()}</h3>
            <div className={isRead ? "preview-buttons read" : "preview-buttons"}>
                <i onClick={handleArchive} className={isArchived ? "fa-regular fa-folder-open" : "fa-regular fa-folder-closed"} title={isArchived ? "Unarchive" : "Archive"}></i>
                <i onClick={moveToTrash} className="fa-regular fa-trash-can" title="Move to Trash"></i>
                <i onClick={handleUnread} className={isRead ? "fa-solid fa-envelope-circle-check" : " fa-regular fa-envelope-open"} title={isRead ? "Mark Unread" : "Mark as Read"}></i>
            </div>
        </div>
    )
}