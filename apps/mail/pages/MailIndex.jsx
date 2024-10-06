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
    const [filterBy, setFilterBy] = useState({ text: '', isInbox: true, isStarred: false, isTrash: false, isSent: false })
    const [isLoading, setIsLoading] = useState(false)
    const [isLoading2, setIsLoading2] = useState(true)

    const cleanFilter = useRef({ text: '', isInbox: true, isStarred: false, isTrash: false, isSent: false })
    const params = useParams()

    useEffect(() => {
        if (params.mailID) setIsLoading(true)
        if (!params.mailID) setIsLoading2(true)
        changeFilterByParams()
        loadMails()
    }, [filterBy, params.category, params.mailID])

    function loadMails() {
        mailService.query(filterBy)
            .then(result => {
                setMails(result)
                setIsLoading(false)
                setIsLoading2(false)
            })
    }

    function changeFilterBy(ev) {
        setFilterBy({ ...filterBy, text: ev.target.value })
    }

    function changeFilterByParams() {
        if (params.category === 'inbox' && filterBy.isInbox !== true) setFilterBy(cleanFilter.current)
        if (params.category === 'starred' && filterBy.isStarred !== true) setFilterBy({ ...filterBy, isInbox: false, isStarred: true, isTrash: false, isSent: false })
        if (params.category === 'trash' && filterBy.isTrash !== true) setFilterBy({ ...filterBy, isInbox: false, isStarred: false, isTrash: true, isSent: false })
        if (params.category === 'sent' && filterBy.isSent !== true) setFilterBy({ ...filterBy, isInbox: false, isStarred: false, isTrash: false, isSent: true })
    }

    if (isLoading) return (
        <main className="mail-container">
            <MailFilter filterBy={filterBy} changeFilterBy={changeFilterBy} />
            <div className="progress" />
        </main>
    )

    if (isLoading2) return (
        <main className="mail-container">
            <MailFilter filterBy={filterBy} changeFilterBy={changeFilterBy} />
            <div className="progress2" />
        </main>
    )
    

    return (
        <main className="mail-container">
            <MailFilter filterBy={filterBy} changeFilterBy={changeFilterBy} />
            {params.mailID ? <MailDetails mailID={params.mailID} /> : <MailList mails={mails} />}
            <MailSend />
        </main>
    )
}

