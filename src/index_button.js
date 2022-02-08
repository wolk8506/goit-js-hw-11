import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
});

const input = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const imageList = document.querySelector('.gallery');

const KEY = '25582463-bd7a1371f0d74f28c5559b6f0';
const URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;
const imageParam = '&image_type=photo&orientation=horizontal&safesearch=true';

let search = '';
let markup = '';
let page = 1;
let totalImages = null;
let imagesViewedSum = null;

input.addEventListener('input', inputSearch);
input.addEventListener('submit', loadImages);
loadMore.addEventListener('click', loadMoreImages);
loadMore.style.display = 'none';

function loadImages(e) {
  e.preventDefault();

  markup = '';
  page = 1;
  imagesViewedSum = null;
  searchGo();
  loadMore.style.display = 'block';
}

function loadMoreImages() {
  searchGo();
}

function inputSearch() {
  search = input.searchQuery.value;
  // console.log(input.searchQuery.value);
}

// const fetchUsers = async () => {
//   const response = await fetch(`${URL}?key=${KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}&SameSite=None`);
//   const images = await response.json();
//   return images;
// };

const axios = require('axios');

function searchGo() {
  axios
    .get(
      `${URL}?key=${KEY}&q=${search}${imageParam}&page=${page}&per_page=${PER_PAGE}&SameSite=None`,
    )
    .then(images => {
      totalImages = images.data.totalHits;
      notificationTotalImage();
      render(images.data.hits);
    })
    .catch(error => {
      console.log(error);
    });

  page += 1;
}

function notificationTotalImage() {
  if (totalImages > 0 && page === 2) {
    Notiflix.Notify.info(`Hooray! We found ${totalImages} images.`);
  }
}

function render(images) {
  imagesViewedSum += images.length;

  if (imagesViewedSum === totalImages && images.length >= 1) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");

    loadMore.style.display = 'none';
  } else if (images.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );

    loadMore.style.display = 'none';
    imageList.innerHTML = markup;
    return;
  }

  markup += images
    .map(({ largeImageURL, previewURL, tags, likes, views, comments, downloads }) => {
      return `
              <a href="${largeImageURL}"  onclick="event.preventDefault()" >
                <div class="photo-card">
                  <img class="photo-img" src="${previewURL}" alt="${tags}" width="300" height="200" loading="lazy" />
                  <div class="info">
                    <p class="info-item">
                    <b>Likes</b>${likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b>${views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b>${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b>${downloads}
                    </p>
                  </div>
                </div>
              </a>`;
    })
    .join('');

  imageList.innerHTML = markup;
  lightbox.refresh();
  // console.log(images.length);

  const { height: cardHeight } = imageList;
  imageList.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
