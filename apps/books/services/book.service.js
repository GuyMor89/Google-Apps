import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { defaultBooks } from '../services/books.js'

const storageKey = 'BookDB'

export const bookService = {
    query,
    get,
    remove,
    save,
    getFilterFromSearchParams,
    cleanFilter
}

function query(filterBy = {}) {
    return storageService.query(storageKey)
        .then(books => {
            if (!books || !books.length > 0) {
                utilService.saveToStorage(storageKey, defaultBooks)
                return utilService.loadFromStorage(storageKey)
            }
            if (filterBy.text) {
                const regex = new RegExp(filterBy.text, 'i')
                books = books.filter(book => regex.test(book.title))
            }
            if (filterBy.price) {
                books = books.filter(book => book.listPrice.amount >= +filterBy.price)
            }
            return books
        })
}

function get(bookID) {
    return storageService.get(storageKey, bookID)
}

function remove(bookID) {
    return storageService.remove(storageKey, bookID)
}

function save(book) {
    if (book.id) {
        return storageService.put(storageKey, book)
    } else {
        return storageService.post(storageKey, book)
    }
}

function getFilterFromSearchParams(searchParams) {
    if (searchParams.size === 0) return {text: '', price: '' }

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