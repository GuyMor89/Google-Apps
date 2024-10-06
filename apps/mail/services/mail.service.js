import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'
import { defaultMails } from '../services/mails.js'

const storageKey = 'MailDB'

export const mailService = {
    query,
    get,
    remove,
    save,
    getFilterFromSearchParams,
    cleanFilter
}

function query(filterBy = {}) {
    return storageService.query(storageKey)
        .then(mails => {
            if (!mails || !mails.length > 0) {
                utilService.saveToStorage(storageKey, defaultMails)
                return utilService.loadFromStorage(storageKey)
            }
            if (filterBy.isInbox) {
                mails = mails.filter(mail => !mail.removedAt)
            }
            if (filterBy.isStarred) {
                mails = mails.filter(mail => mail.isStarred === true)
            }
            if (filterBy.isTrash) {
                mails = mails.filter(mail =>  mail.removedAt)
            }
            if (filterBy.isSent) {
                mails = mails.filter(mail => mail.from === 'user@gmail.com')
            }
            if (filterBy.text) {
                const regex = new RegExp(filterBy.text, 'i')
                mails = mails.filter(mail => regex.test(mail.subject) 
                || regex.test(mail.from)
                || regex.test(mail.body))
            }
            return mails
        })
}

function get(mailID) {
    return storageService.get(storageKey, mailID)
}

function remove(mailID) {
    return storageService.remove(storageKey, mailID)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(storageKey, mail)
    } else {
        return storageService.post(storageKey, mail)
    }
}

function getFilterFromSearchParams(searchParams) {
    if (searchParams.size === 0) return {text: ''}

    const newFilter = {}
    for (let [key, value] of searchParams.entries()) {
        newFilter[key] = value
    }
    return newFilter
}

function cleanFilter(filter) {
    const cleanFilter = {}
    for (let key in filter) {
        if (filter[key]) cleanFilter[key] = filter[key]
    }
    return cleanFilter
}