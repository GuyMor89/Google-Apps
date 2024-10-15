import { eventBusService } from "../services/event-bus.service.js"

const { useState, useEffect, useRef } = React

export function UserMsg() {

    const [msg, setMsg] = useState(null)

    const timeoutRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-user-msg', msg => {
            clearInterval(timeoutRef.current)
            setMsg(msg)
            timeoutRef.current = setTimeout(() => {
                setMsg(null)
            }, 3000)
        })

        return unsubscribe
    }, [])


    function closeMsg() {
        clearInterval(timeoutRef.current)
        setMsg(null)
    }

    if (!msg) return null
    return (
        <section className={`user-msg ${msg.type}`}>
            <h4>{msg.txt}</h4>
            {/* <button onClick={closeMsg} className="close-btn">X</button> */}
        </section>
    )
}