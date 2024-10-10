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
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState({ first: true, second: false })

    const debounceFilters = useRef(utilService.debounce(setFilterBy, 500))
    const params = useParams()

    useEffect(() => {
        if (params.mailID) setIsLoading({ ...isLoading, first: true })
        if (!params.mailID) setIsLoading({ ...isLoading, second: true })
        changeCategoryByRouteParams()
        loadMails()
    }, [filterBy, params.category, params.mailID])

    function loadMails() {
        mailService.query(filterBy)
            .then(({mails, amountOfMails}) => {
                setMails(mails)
                setAmountOfMails(amountOfMails)
                setIsLoading({ first: false, second: false })
            })
    }

    function changeFilterBy(ev) {
        debounceFilters.current({ ...filterBy, text: ev.target.value })
    }

    function changeCategoryByRouteParams() {
        if (params.category === 'inbox' && filterBy.isInbox !== true) setFilterBy(mailService.getDefaultFilter)
        if (params.category === 'starred' && filterBy.isStarred !== true) setFilterBy({ ...filterBy, sort: {date: '', subject: ''}, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: true, isSent: false, isDraft: false, isTrash: false,  all: false })
        if (params.category === 'sent' && filterBy.isSent !== true) setFilterBy({ ...filterBy, sort: {date: '', subject: ''}, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: false, isSent: true, isDraft: false, isTrash: false, all: false })
        if (params.category === 'draft' && filterBy.isDraft !== true) setFilterBy({ ...filterBy, sort: {date: '', subject: ''}, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: false, isSent: false, isDraft: true, isTrash: false, all: false })
        if (params.category === 'trash' && filterBy.isTrash !== true) setFilterBy({ ...filterBy, sort: {date: '', subject: ''}, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: false, isSent: false, isDraft: false, isTrash: true, all: false })
        if (params.category === 'all' && filterBy.all !== true) setFilterBy({ ...filterBy, sort: {date: '', subject: ''}, isInbox: false, isPrimary: false, isPromotions: false, isSocial: false, isStarred: false, isSent: false, isDraft: false, isTrash: false, all: true })
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
            {params.mailID ? <MailDetails mailID={params.mailID} /> : <MailList mails={mails} filterBy={filterBy} setFilterBy={setFilterBy} amountOfMails={amountOfMails}/>}
            <MailSend />
        </main>
    )
}

