import { storageService } from "./util.js"
import { showLoader, hideLoader, searchValue } from "./controller.js"

export { retrieveData }

const storageKeys = { videos: 'videosData', wiki: 'wikiData' }

function retrieveData(API) {
    showLoader()

    let dataKeyword
    let storageKey

    if (API.includes('youtube')) {
        storageKey = storageKeys.videos
        dataKeyword = 'videos'
    } else {
        storageKey = storageKeys.wiki
        dataKeyword = 'wiki'
    }

    return storageService.query(storageKey)
        .then(result => result.filter(videoArray => videoArray[searchValue]))
        .then(result => {
            if (result.length > 0) {
                return [result[0][searchValue], dataKeyword]
            } else {
                return fetch(API)
                    .then(response => response.json())
                    .then(data => {
                        let savedData = saveData(data)
                        let dataToSave = { [searchValue]: savedData }
                        storageService.post(storageKey, dataToSave)
                        return [savedData, dataKeyword]
                    })
                    .catch(() => hideLoader())
            }
        })
}

function saveData(data) {
    let dataArrayToPush

    if (data.kind) {
        const { items } = data
        dataArrayToPush = items.map(({ id, snippet }) => ({ id: id.videoId, title: snippet.title, description: snippet.description, thumbnail: snippet.thumbnails.medium.url }))
    } else {
        const { query } = data
        const { search } = query
        dataArrayToPush = search.map(({ title, snippet }) => ({ title, snippet }))
    }
    return dataArrayToPush
}


