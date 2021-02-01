'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
/// Challenge 2

const wait = function (sec) {
  return new Promise(function (resolve) {
    setTimeout(resolve, sec * 1000);
  });
};

const imgContainer = document.querySelector('.images');

const createImg = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');

    img.src = imgPath;
    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('No image'));
    });
  });
};
let thisImg;
createImg('img/img-1.jpg')
  .then(img => {
    thisImg = img;
    console.log('Image 1 well loaded');
    return wait(2);
  })
  .then(() => {
    thisImg.style.opacity = 0;
    return createImg('img/img-2.jpg');
  })
  .then(img => {
    thisImg = img;
    console.log('Image 2 well loaded');
    return wait(2);
  })
  .then(() => {
    thisImg.style.opacity = 0;
    return createImg('img/img-3.jpg');
  })
  .then(img => {
    thisImg = img;
    console.log('Image 3 well loaded');
  })
  .catch(err => console.error(err));
