import { utilService } from "../../../services/util.service.js"
import { mailService } from "../services/mail.service.js"

import { showErrorMsg, showSuccessMsg } from "../../../services/event-bus.service.js"

const { useState, useEffect, useRef } = React
const { useNavigate, Outlet, useLocation, useSearchParams, useParams } = ReactRouterDOM

export function MailSend() {

    const [isComposing, setIsComposing] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams({})

    const toInput = useRef(null)
    const subjectInput = useRef(null)
    const bodyInput = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (searchParams.get('compose') === '') setIsComposing(true)
    }, [searchParams])

    function closeEditor() {
        setSearchParams({})
        setIsComposing(false)
    }

    function sendMail() {
        if (toInput.current.checkValidity() === false) return showErrorMsg('Not a Valid E-Mail Address')

        const newMail = {
            createdAt: Date.now(),
            subject: subjectInput.current.value,
            body: bodyInput.current.value,
            isRead: false,
            sentAt: Date.now(),
            isStarred: false,
            isArchived: false,
            from: 'user@gmail.com',
            to: toInput.current.value
        }

        closeEditor()

        mailService.save(newMail)
            .then(() => {
                showSuccessMsg('E-Mail Sent!')
            })
    }

    return (
        <section className={isComposing ? "mail-send" : "mail-send hidden"}>
            <div className="mail-send-header">
                <span>New Message</span>
                <i className="fa-solid fa-xmark" onClick={closeEditor}></i>
            </div>
            <input ref={toInput} type="email" required name="mail-send-to" id="mail-send-to" placeholder="Recipients" />
            <input ref={subjectInput} type="text" name="mail-send-subject" id="mail-send-subject" placeholder="Subject" />
            <textarea ref={bodyInput} name="mail-send-body" id="mail-send-body"></textarea>
            <article className="mail-send-buttons">
                <div className="send-button" onClick={sendMail}>Send</div>
                <i className="fa-regular fa-trash-can"></i>
            </article>
        </section>
    )
}