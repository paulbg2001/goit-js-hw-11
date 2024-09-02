import { fetchImages } from './partials/api';
import { createMarkup } from './partials/card';


let lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captions: true,
    captionsData: 'alt',
});

const formEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

formEl.addEventListener('submit', onSearch);
loadMoreBtnEl.addEventListener('click', onLoadMore);

let searchQuery;
let page = 0;
const perPage = 40;

loadMoreBtnEl.classList.add('visually-hidden');

function onSearch(e) {
    e.preventDefault();
    // console.log(e)
    searchQuery = e.target.elements.searchQuery.value.trim();
    page = 1;

    if (!searchQuery) {
        Notify.warning('Make your choice.');
    } else {
        page = 1;
        galleryEl.innerHTML = '';

        fetchImages({ searchQuery, page })
            .then(response => {
                if (!response.data.hits.length) {
                    galleryEl.innerHTML = '';
                    Notify.failure(
                        'Sorry, there are no images matching your search query. Please try again.'
                    );
                } else if (page >= Math.ceil(response.data.totalHits / perPage)) {
                    galleryEl.innerHTML = '';
                    renderMarkup(response);
                    Notify.warning(
                        "We're sorry, but you've reached the end of search results."
                    );
                    loadMoreBtnEl.classList.add('visually-hidden');
                } else {
                    galleryEl.innerHTML = '';
                    renderMarkup(response);
                    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
                    lightbox.refresh();
                    loadMoreBtnEl.classList.remove('visually-hidden');
                    console.log(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}

function renderMarkup(response) {
    const markupCards = createMarkup(response);
    galleryEl.insertAdjacentHTML('beforeend', markupCards);
}

function onLoadMore() {
    page += 1;

    fetchImages({ searchQuery, page })
        .then(response => {
            renderMarkup(response);
            lightbox.refresh();
            smoothScroll();
            const totalPages = Math.ceil(response.data.totalHits / perPage);
            if (page >= totalPages) {
                loadMoreBtnEl.classList.add('visually-hidden');
                Notify.warning(
                    "We're sorry, but you've reached the end of search results."
                );
            } else {
                Notify.success(
                    `Hooray! We found ${response.data.totalHits - perPage * (page - 1)
                    } images.`
                );
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function smoothScroll() {
    const { height: cardHeight } =
        galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}
