import { utilService } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'
import { defaultMails } from '../services/mails.js'

const storageKey = 'MailDB'

export const mailService = {
    query,
    get,
    remove,
    save,
    getDefaultFilter,
    getEmptyDraft,
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
                mails = mails.filter(mail => mail.to === 'user@gmail.com')
            }
            let unreadPrimary = ''
            if (filterBy.isPrimary) {
                mails = mails.filter(mail => mail.isPrimary)
                unreadPrimary = mails.filter(mail => !mail.isRead).length
            }
            if (filterBy.isPromotions) mails = mails.filter(mail => mail.isPromotions)
            if (filterBy.isSocial) mails = mails.filter(mail => mail.isSocial)
            if (filterBy.isStarred) {
                mails = mails.filter(mail => mail.isStarred === true)
                mails = mails.filter(mail => !mail.removedAt)
            }
            if (filterBy.isSent) {
                mails = mails.filter(mail => mail.from === 'user@gmail.com')
                mails = mails.filter(mail => mail.sentAt)
                mails = mails.filter(mail => !mail.removedAt)

            }
            if (filterBy.isDraft) {
                mails = mails.filter(mail => mail.sentAt === null)
            }
            if (filterBy.isTrash) {
                mails = mails.filter(mail => mail.removedAt)
            }
            if (filterBy.all) {
                mails = mails.filter(mail => mail.sentAt)
                mails = mails.filter(mail => !mail.removedAt)
            }
            if (filterBy.text) {
                const regex = new RegExp(filterBy.text, 'i')
                mails = mails.filter(mail => regex.test(mail.subject)
                    || regex.test(mail.from)
                    || regex.test(mail.body))
            }
            if (filterBy.sort && filterBy.sort.date) {
                mails = mails.sort((a, b) => (a.sentAt - b.sentAt) * filterBy.sort.date)
            }
            if (filterBy.sort && filterBy.sort.subject) {
                mails = mails.sort((a, b) => (a.subject.localeCompare(b.subject)) * filterBy.sort.subject)
            }
            const amountOfMails = mails.length
            if (filterBy.page) {
                const { currentPage, amountPerPage } = filterBy.page
                const pageStart = (currentPage * amountPerPage)
                const pageEnd = ((currentPage * amountPerPage) + amountPerPage - 1)

                mails = mails.filter((mail, idx) => idx >= pageStart && idx <= pageEnd)
            }
            return { mails, unreadPrimary, amountOfMails }
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

function getDefaultFilter() {
    return {
        text: '', page: { currentPage: 0, amountPerPage: 15 }, sort: { date: '', subject: ''}, isInbox: true, isPrimary: true, isPromotions: false, isSocial: false, isStarred: false, isSent: false, isDraft: false, isTrash: false, all: false
    }
}

function getEmptyDraft() {
    return {
        createdAt: Date.now(),
        subject: "",
        body: "",
        isRead: false,
        sentAt: null,
        isStarred: false,
        isArchived: false,
        from: 'user@gmail.com',
        to: ""
    }
}

function getFilterFromSearchParams(searchParams) {
    if (searchParams.size === 0) return { text: '' }

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