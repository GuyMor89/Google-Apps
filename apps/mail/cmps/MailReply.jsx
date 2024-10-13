import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailReply({ mail, currentAction, setCurrentAction }) {

    const [draft, setDraft] = useState(mailService.getEmptyReply)

    const toInput = useRef(null)
    const bodyInput = useRef(null)
    const debouncedBody = useRef(utilService.debounce(saveDraft, 1000))

    const navigate = useNavigate()

    const { id, createdAt, subject, body, isRead, isStarred, sentAt, removedAt, replies, from, to } = mail
    const { isReplying, isForwarding } = currentAction

    function saveDraft(draft) {
        if (toInput.current.checkValidity() === false) return
        if (bodyInput.current.checkValidity() === false) return

        const newMail = {
            body: bodyInput.current.value,
            to: toInput.current.value
        }
        const newDraft = { ...draft, ...newMail }

        setDraft(newDraft)
    }

    console.log(draft)

    function sendReply() {
        if (!draft.to) return showErrorMsg(`Please enter a valid address`)
        if (!draft.body) return showErrorMsg(`Can't send empty mail`)

        setCurrentAction({ isReplying: false, isForwarding: false })

        if (isForwarding)
            mailService.save({ ...draft, sentAt: Date.now() })
                .then(() => {
                    showSuccessMsg('E-Mail Forwarded!')
                })

        if (isReplying)
            mailService.save({ ...mail, replies: [...replies, { ...draft, sentAt: Date.now() }] })
                .then((result) => {
                    console.log(result)
                    showSuccessMsg('Reply Sent!')
                })
    }

    return (
        (isReplying || isForwarding) &&
        <section className="mail-reply">
            <input ref={toInput} type="email" defaultValue={isForwarding ? '' : to} onChange={() => debouncedBody.current(draft)} required name="mail-reply-to-input" id="mail-reply-to-input" placeholder="Recipients" />
            <textarea ref={bodyInput} defaultValue={isForwarding ? body : ''} onChange={() => debouncedBody.current(draft)} name="mail-reply-body-input" id="mail-reply-body-input"></textarea>
            <article className="mail-send-buttons">
                <div className="send-button" onClick={sendReply}>Send</div>
                <i className="fa-regular fa-trash-can" onClick={() => setCurrentAction({ isReplying: false, isForwarding: false })}></i>
            </article>
        </section>
    )
}