import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailSend() {

    const [isComposing, setIsComposing] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams({})
    const [draft, setDraft] = useState(mailService.getEmptyDraft)

    const toInput = useRef(null)
    const subjectInput = useRef(null)
    const bodyInput = useRef(null)
    const debouncedBody = useRef(utilService.debounce(saveDraft, 1000))

    const navigate = useNavigate()

    useEffect(() => {
        if (searchParams.get('compose') !== null) setIsComposing(true)

        const savedDraftID = searchParams.get('compose')
        if (savedDraftID !== null && savedDraftID !== '')
            mailService.get(savedDraftID)
                .then(restoreDraft)
    }, [searchParams])

    function closeEditor() {
        setSearchParams({})
        setIsComposing(false)
    }

    function restoreDraft(draft) {
        toInput.current.value = draft.to
        subjectInput.current.value = draft.subject
        bodyInput.current.value = draft.body
        setDraft(draft)
    }

    function saveDraft(draft) {
        if (toInput.current.checkValidity() === false) return

        const newMail = {
            subject: subjectInput.current.value,
            body: bodyInput.current.value,
            to: toInput.current.value
        }
        const newDraft = { ...draft, ...newMail }

        if (draft.id) mailService.get(draft.id)
            .then(draft => {
                mailService.save(newDraft)
                setDraft(draft)
            })
        else mailService.save(newDraft)
            .then(draft => setDraft(draft))
    }

    function sendMail() {
        if (!draft.to) return showErrorMsg(`Can't send empty mail`)

        closeEditor()

        mailService.save({ ...draft, sentAt: Date.now() })
            .then(() => {
                showSuccessMsg('E-Mail Sent!')
            })
    }

    function deleteDraft() {
        if (draft.id) {
            closeEditor()
            mailService.remove(draft.id)
        } else closeEditor()
    }

    return (
        <section className={isComposing ? "mail-send" : "mail-send hidden"}>
            <div className="mail-send-header">
                <span>New Message</span>
                <i className="fa-solid fa-xmark" onClick={closeEditor}></i>
            </div>
            <input ref={toInput} type="email" required name="mail-send-to" id="mail-send-to" placeholder="Recipients" />
            <input ref={subjectInput} type="text" name="mail-send-subject" id="mail-send-subject" placeholder="Subject" />
            <textarea ref={bodyInput} onChange={() => debouncedBody.current(draft)} name="mail-send-body" id="mail-send-body"></textarea>
            <article className="mail-send-buttons">
                <div className="send-button" onClick={sendMail}>Send</div>
                <i className="fa-regular fa-trash-can" onClick={deleteDraft}></i>
            </article>
        </section>
    )
}