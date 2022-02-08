import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

var lightbox = new SimpleLightbox('.gallery a', {
  //captionsData: 'alt',
});

const KEY = '25582463-bd7a1371f0d74f28c5559b6f0';
const URL = 'https://pixabay.com/api/';
const search = 'dog';

const imageList = document.querySelector('.gallery');

const fetchUsers = async () => {
  const response = await fetch(`${URL}?key=${KEY}&q=${search}&image_type=photo`);
  const images = await response.json();
  return images;
};

fetchUsers().then(images => {
  //   console.log(images);
  render(images.hits);
});

function render(images) {
  const markup = images
    .map(image => {
      return `
                   <a href="${image.largeImageURL}"  onclick="event.preventDefault()" ><div class="photo-card"><img src="${image.previewURL}" alt="${image.tags}" width="300" loading="lazy" />
                  <div class="info">
                  <p class="info-item">
                  <b>Likes</b>${image.likes}
                  </p>
                  <p class="info-item">
                  <b>Views</b>${image.views}
                  </p>
                  <p class="info-item">
                  <b>Comments</b>${image.comments}
                  </p>
                  <p class="info-item">
                  <b>Downloads</b>${image.downloads}
                  </p>
              </div></div></a>`;
    })
    .join('');

  imageList.innerHTML = markup;
  lightbox.refresh();
}
