import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

import { MailPreview } from "../cmps/MailPreview.jsx"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailList({ mails, filterBy, setFilterBy, amountOfMails, unreadAllCheckedMails }) {

    const [noMailType, setNoMailType] = useState(null)
    const [lastAction, setLastAction] = useState(Date.now())
    const [isChecked, setIsChecked] = useState(null)
    const [checkedMailIDs, setCheckedMailIDs] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const params = useParams()
    const navigate = useNavigate()

    const { sort, isInbox, isPrimary, isPromotions, isSocial } = filterBy
    const { date, subject, read } = sort

    let { currentPage, amountPerPage } = filterBy.page
    const startNum = amountOfMails === 0 ? amountOfMails : currentPage * amountPerPage + 1
    const endNum = amountOfMails < (startNum + amountPerPage) ? amountOfMails : startNum + amountPerPage - 1

    const { shortDate, shortHour, formattedDate, relativeTime } = utilService.formatDate(lastAction)

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

    function handlePageChange(event) {
        const pressedLeft = event.target.className.includes('left')
        const pressedRight = event.target.className.includes('right')

        if (startNum === 1 && pressedLeft) return
        if (endNum === amountOfMails && pressedRight) return

        let diff
        pressedLeft ? diff = -1 : diff = 1
        setFilterBy({ ...filterBy, page: { ...filterBy.page, currentPage: currentPage + diff } })
    }

    function checkAllMails() {
        const mailIDs = mails.reduce((ids, mail) => {
            ids.push(mail.id)
            return ids
        }, [])

        return setCheckedMailIDs(prev => prev.length > 0 ? [] : mailIDs)
    }

    function handleCheckClass() {
        if (checkedMailIDs.length === mails.length) return "fa-regular fa-square-check"
        if (checkedMailIDs.length > 0 && checkedMailIDs.length < mails.length) return "fa-regular fa-square-minus"
        return "fa-regular fa-square"
    }

    const thereAreMails = mails.length !== 0

    if (isLoading) return <div className="progress" />

    return (
        <article className="mail-list">
            <div className="mail-list-nav">
                <div className="mail-list-buttons">
                    <i onClick={checkAllMails} className={handleCheckClass()} title="Select All"></i>
                    <i onClick={() => unreadAllCheckedMails([])} className="fa-solid fa-rotate-right" title="Refresh"></i>
                    <i onClick={() => checkedMailIDs.length > 0 && unreadAllCheckedMails(checkedMailIDs)} className="fa-regular fa-envelope-open" title="Mark as Read"></i>
                </div>
                <div className="mail-sort-container">
                    <div onClick={() => { date === '' || date === 1 ? setFilterBy({ ...filterBy, sort: { ...sort, date: -1 } }) : setFilterBy({ ...filterBy, sort: { ...sort, date: 1 } }) }}>
                        <i className={date === '' || date === 1 ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                        <span>Date</span>
                    </div>
                    <div onClick={() => { subject === '' || subject === 1 ? setFilterBy({ ...filterBy, sort: { ...sort, subject: -1 } }) : setFilterBy({ ...filterBy, sort: { ...sort, subject: 1 } }) }}>
                        <i className={subject === '' || subject === 1 ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                        <span>Subject</span>
                    </div>
                    <div onClick={() => { read === '' || read === 1 ? setFilterBy({ ...filterBy, sort: { ...sort, read: -1 } }) : setFilterBy({ ...filterBy, sort: { ...sort, read: 1 } }) }}>
                        <i className={read === '' || read === 1 ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                        <span>Read</span>
                    </div>
                </div>
                <div className="mail-list-counter">
                    <span>{startNum} - {endNum} of {amountOfMails}</span>
                    <i className={currentPage === 0 ? "fa-solid fa-angle-left faint" : "fa-solid fa-angle-left"} onClick={handlePageChange}></i>
                    <i className={endNum === amountOfMails ? "fa-solid fa-angle-right faint" : "fa-solid fa-angle-right"} onClick={handlePageChange}></i>
                </div>
            </div>
            {
                isInbox &&
                <div className="mail-list-tabs">
                    <div className={isPrimary ? "mail-list-tabs-primary blue" : "mail-list-tabs-primary"} onClick={() => setFilterBy({ text: '', page: { currentPage: 0, amountPerPage: 15 }, sort: { ...sort }, isInbox: true, isPrimary: true, isPromotions: false, isSocial: false, isStarred: false, isSent: false, isDraft: false, isTrash: false, all: false })}>
                        <i className="fa-solid fa-inbox"></i>
                        <span>Primary</span>
                        <div className={isPrimary ? "mail-list-tabs-bar chosen" : "mail-list-tabs-bar"}></div>
                    </div>
                    <div className={isPromotions ? "mail-list-tabs-promotions blue" : "mail-list-tabs-promotions"} onClick={() => setFilterBy({ text: '', page: { currentPage: 0, amountPerPage: 15 }, sort: { ...sort }, isInbox: true, isPrimary: false, isPromotions: true, isSocial: false, isStarred: false, isSent: false, isDraft: false, isTrash: false, all: false })}>
                        <i className="fa-solid fa-tag"></i>
                        <span>Promotions</span>
                        <div className={isPromotions ? "mail-list-tabs-bar chosen" : "mail-list-tabs-bar"}></div>
                    </div>
                    <div className={isSocial ? "mail-list-tabs-social blue" : "mail-list-tabs-social"} onClick={() => setFilterBy({ text: '', page: { currentPage: 0, amountPerPage: 15 }, sort: { ...sort }, isInbox: true, isPrimary: false, isPromotions: false, isSocial: true, isStarred: false, isSent: false, isDraft: false, isTrash: false, all: false })}>
                        <i className="fa-solid fa-user-group"></i>
                        <span>Social</span>
                        <div className={isSocial ? "mail-list-tabs-bar chosen" : "mail-list-tabs-bar"}></div>
                    </div>
                </div>
            }
            {
                thereAreMails
                    ?
                    mails.map(mail =>
                        <MailPreview key={mail.id} mail={mail} checkedMailIDs={checkedMailIDs} setCheckedMailIDs={setCheckedMailIDs} />)
                    :
                    noMailMessage()
            }
            <div className="mail-list-footer">
                <div className="data-usage">
                    <div className="data-usage-bar"></div>
                    <div className="data-usage-stats">0.01GB of 15GB used</div>
                </div>
                <div className="last-activity">Last Account Activity: {formattedDate} ({relativeTime})</div>
            </div>
        </article >
    )
}
