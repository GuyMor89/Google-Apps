import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { MailDetails } from "./MailDetails.jsx"
import { MailSend } from "./MailSend.jsx"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter)
    const [amountOfMails, setAmountOfMails] = useState(null)
    const [unreadMails, setUnreadMails] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState({ first: true, second: false })

    const debounceFilters = useRef(utilService.debounce(setFilterBy, 500))
    const params = useParams()

    useEffect(() => {
        if (params.mailID) setIsLoading({ ...isLoading, first: true })
        if (!params.mailID) setIsLoading({ ...isLoading, second: true })
        changeCategoryByRouteParams()
        loadMails()
    }, [params.category, params.mailID])

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then(({ mails, amountOfMails, unreadPrimary }) => {
                setMails(mails)
                setAmountOfMails(amountOfMails)
                setUnreadMails(unreadPrimary)
                setIsLoading({ first: false, second: false })
            })
    }

    function changeFilterBy(ev) {
        debounceFilters.current({ ...filterBy, text: ev.target.value })
    }

    function changeCategoryByRouteParams() {
        if (params.category === 'inbox' && filterBy.isInbox !== true) setFilterBy(mailService.getDefaultFilter)
        if (params.category === 'starred' && filterBy.isStarred !== true) setFilterBy({ ...filterBy, sort: { date: '', subject: '', read: ''}, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: true, isSent: false, isDraft: false, isTrash: false, all: false })
        if (params.category === 'sent' && filterBy.isSent !== true) setFilterBy({ ...filterBy, sort: { date: '', subject: '', read: '' }, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: false, isSent: true, isDraft: false, isTrash: false, all: false })
        if (params.category === 'draft' && filterBy.isDraft !== true) setFilterBy({ ...filterBy, sort: { date: '', subject: '', read: '' }, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: false, isSent: false, isDraft: true, isTrash: false, all: false })
        if (params.category === 'trash' && filterBy.isTrash !== true) setFilterBy({ ...filterBy, sort: { date: '', subject: '', read: '' }, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: false, isSent: false, isDraft: false, isTrash: true, all: false })
        if (params.category === 'all' && filterBy.all !== true) setFilterBy({ ...filterBy, sort: { date: '', subject: '', read: '' }, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: false, isSent: false, isDraft: false, isTrash: false, all: true })
    }

    function unreadAllCheckedMails(checkedMailIDs) {
        setIsLoading({first: true, second: false} )
        const unreadMailsPromises = checkedMailIDs.map(id => {
            const mail = mails.find(mail => mail.id === id)
            return mailService.save({ ...mail, isRead: true })
        })

        Promise.all(unreadMailsPromises)
            .then(savedMails => {
                const updatedMails = JSON.parse(localStorage.getItem('MailDB')).map(mail => {
                    const updatedMail = savedMails.find(savedMail => savedMail.id === mail.id)
                    return updatedMail ? updatedMail : mail
                })
                localStorage.setItem('MailDB', JSON.stringify(updatedMails))
                loadMails()
            })
    }


    if (isLoading.first || isLoading.second) return (
        <main className="mail-container">
            <MailFilter filterBy={filterBy} changeFilterBy={changeFilterBy} />
            {isLoading.first && <div className="progress" />}
            {isLoading.second && <div className="progress2" />}
        </main>
    )

    return (
        <main className="mail-container">
            <MailFilter filterBy={filterBy} changeFilterBy={changeFilterBy} />
            {params.mailID ? <MailDetails mailID={params.mailID} /> : <MailList mails={mails} filterBy={filterBy} setFilterBy={setFilterBy} amountOfMails={amountOfMails} unreadAllCheckedMails={unreadAllCheckedMails} />}
            <MailSend />
        </main>
    )
}

