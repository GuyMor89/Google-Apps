const { useState} = React

export function LongText({ text, length = 100 }) {

    const [isShort, setIsShort] = useState(true)

    const shortText = `${text.slice(0, length)}..`

    return (
        <React.Fragment>
            {isShort &&
                <React.Fragment>
                    <h4>{shortText}</h4><span onClick={() => setIsShort(false)}>Read More</span>
                </React.Fragment>}
            {!isShort &&
                <React.Fragment>
                    <h4>{text}</h4><span onClick={() => setIsShort(true)}>Read Less</span>
                </React.Fragment>}
        </React.Fragment>
    )
}