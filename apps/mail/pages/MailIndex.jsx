import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"
import { defaultMails } from "../services/mails.js"

import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailList } from "../cmps/MailList.jsx"
import { MailDetails } from "./MailDetails.jsx"
import { Loader } from "../../../cmps/Loader.jsx"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [filterBy, setFilterBy] = useState({ text: '', isInbox: true, isStarred: false, isTrash: false })
    const [isLoading, setIsLoading] = useState(true)

    const cleanFilter = useRef({ text: '', isInbox: true, isStarred: false, isTrash: false })

    const params = useParams()

    useEffect(() => {
        changeFilterByParams()
        loadMails()
    }, [filterBy, params])

    function loadMails() {
        mailService.query(filterBy)
            .then(result => {
                setMails(result)
                setIsLoading(false)
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

    return (
        <main className="mail-container">
            <MailFilter filterBy={filterBy} changeFilterBy={changeFilterBy} />
            {params.mailID ? <MailDetails mailID={params.mailID} /> : <MailList mails={mails} />}
        </main>
    )
}

