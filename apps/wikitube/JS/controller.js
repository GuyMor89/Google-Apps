import { retrieveData } from "./service.js"
import { storageService } from "./util.js"

export { showLoader, hideLoader, searchValue }

window.onInit = onInit

// const API_KEY = 'AIzaSyAidkPm4wJUPqkrTvMJf9zRE5Bnt9fDo5w'
const API_KEY = 'AIzaSyDXLCT1WhcKet2-VBh_v4CZmhZYxrOdEaE'
const YOUTUBE_API = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${API_KEY}`
const WIKIPEDIA_API = `https://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search`

let searchValue = 'Everest'

function onInit() {
    requestData()
    addSearchListener()
    addModalListeners()
    addColorListeners()
    addVideoListener()
    renderPreviousSearches()
}

function requestData() {
    retrieveData(`${YOUTUBE_API}&q=${searchValue}`)
        .then(result => renderData(result[0], result[1]))
    retrieveData(`${WIKIPEDIA_API}&srsearch=${searchValue}&format=json`)
        .then(result => renderData(result[0], result[1]))
}

function renderData(array, type) {
    if (type === 'videos') {
        const videosHTML = array.map(({ id, title, description, thumbnail }, index) => `
        <div id="${id}">
            <img src="${thumbnail}">
            <a>${title}</a>
            <span>${description}
            <article class="loader video-loader">
                <div class="ball ball1"></div>
                <div class="ball ball2"></div>
                <div class="ball ball3"></div>
            </article>
        </div>
        `)

        $('.videos-container').html(videosHTML)

        const videoURL = `https://www.youtube.com/embed/${array[0].id}`
        $('.player-container>iframe').attr('src', videoURL)

        hideLoader()
    } else {
        const wikiHTML = array.map(({ title, snippet }, index) => `
        <div class="wiki${index}">
            <span onclick="window.open('https://en.wikipedia.org/wiki/${title}', '_blank')">${title}</span>
            <p>${snippet}</p>
            <article class="loader wiki-loader">
                <div class="ball ball1"></div>
                <div class="ball ball2"></div>
                <div class="ball ball3"></div>
            </article>
        </div>
        `)

        $('.wiki-container').html(wikiHTML)

        hideLoader()
    }
}

function addSearchListener() {
    $('.submit-btn').on('click', (event) => {
        event.preventDefault()

        if ($('#search-input').val() === '') return

        searchValue = $('#search-input').val()
        $('#search-input').val('')

        let savedSearches = storageService.query('savedSearches') || []
        savedSearches
            .then(savedSearches => {
                if (!savedSearches.some(search => search === searchValue)) {
                    return storageService.post('savedSearches', { search: searchValue })
                }
            })
            .then(() => renderPreviousSearches())
        requestData()
    })
    $('.saved-searches').on('click', 'span', (event) => {
        searchValue = $(event.currentTarget).text()
        requestData()
        $('.logo').focus()
    })
    $('.fa-eraser').on('click', () => {
        Swal.fire({
            title: "Delete previous searches?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete!"
        }).then((result) => {
            if (result.isConfirmed) {
                storageService.clear('savedSearches')
                    .then(() => renderPreviousSearches())
                Swal.fire({
                    title: "Deleted!",
                    text: "Previous searches have been deleted.",
                    icon: "success"
                })
            }
        })
    })
}

function addVideoListener() {
    $('.videos-container').on('click', 'div', (event) => {
        const videoID = event.currentTarget.id
        const videoURL = `https://www.youtube.com/embed/${videoID}`

        $('.player-container>iframe').attr('src', videoURL)
        $('.logo').focus()
    })
}

function addModalListeners() {
    $('.open-modal').on('click', () => {
        $('.modal-container').removeClass('hidden')
        $('.modal-overlay').addClass('overlay-on')
    })
    $('.modal-overlay').off('click').on('click', () => {
        $('.modal-container').addClass('hidden')
        $('.modal-overlay').removeClass('overlay-on')
    })
}

function addColorListeners() {
    $('#bgc-input').on('input', () => {
        $('.main-content').css('background-color', $('#bgc-input').val())
    })
}

function renderPreviousSearches() {
    let savedSearches = storageService.query('savedSearches') || []

    savedSearches
        .then(savedSearches => {
            const savedSearchHTML = savedSearches.length > 0
                ? savedSearches.map(({ search }) => `<span>${search}</span>`)
                : '<i>No searches yet..</i>'
            $('.saved-searches').html(savedSearchHTML)
        })
}

function showLoader() {
    $('.loader').each((i, loader) => {
        setTimeout(() => {
            $(loader).css('visibility', 'visible')
        }, 500);
    })
}

function hideLoader() {
    $('.loader').each((i, loader) => {
        setTimeout(() => {
            $(loader).css('visibility', 'hidden')
        }, 500);
    })
}