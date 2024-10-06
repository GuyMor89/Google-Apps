export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    getRandomColor,
    padNum,
    loadFromStorage,
    saveToStorage,
    formatDate,
    debounce,
    animateCSS
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key)
    return JSON.parse(val)
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function padNum(num) {
    return (num > 9) ? num + '' : '0' + num
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function formatDate(ms) {
    const date = new Date(ms)

    // Format the date and time
    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)

    // Calculate relative time (e.g., "1 day ago")
    const now = new Date()
    const timeDifference = now - date
    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    let relativeTime
    if (days > 30) {
        relativeTime = `${months} month${months > 1 ? 's' : ''} ago`
    } else if (days > 0) {
        relativeTime = `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
        relativeTime = `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
        relativeTime = `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
        relativeTime = `just now`
    }

    return `${formattedDate} (${relativeTime})`
}

function debounce(func, delay) {
    let timeoutId
    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    };
}

function animateCSS(el, animation = 'bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}
