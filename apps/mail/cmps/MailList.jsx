import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

import { MailPreview } from "../cmps/MailPreview.jsx"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailList({ mails }) {

    const [noMailType, setNoMailType] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        setIsLoading(true) 
    }, [params])

    useEffect(() => {
        if (params.category === 'starred') setNoMailType('starred')
        else if (params.category === 'trash') setNoMailType('trash')
        else if (params.category === 'sent') setNoMailType('sent')
        else setNoMailType('inbox')
        setIsLoading(false)
    }, [mails])

    function noMailMessage() {
        if (noMailType === 'inbox') return <h2>Your Primary tab is empty.</h2>
        if (noMailType === 'starred') return <h2>No starred messages. Stars let you give messages a special status to make them easier to find. To star a message, click on the star outline beside any message or conversation.</h2>
        if (noMailType === 'trash') return <h2>No conversations in Trash. Messages that have been in Trash more than 30 days will be automatically deleted.</h2>
        if (noMailType === 'sent') return <h2>No sent messages. Send a message today!</h2>
    }
    const thereAreMails = mails.length !== 0

    if (isLoading) return <div className="progress" />

    return (
        <article className="mail-list">
            {thereAreMails
                ?
                mails.map(mail =>
                    <MailPreview key={mail.id} mail={mail} />)
                :
                <article className="no-mails">
                    {noMailMessage()}
                </article>
            }
        </article>
    )
}
