'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

/// Challenge3
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
///1
const loadPause = async function () {
  try {
    let img = await createImg('img/img-1.jpg');
    console.log('Image 1 well loaded');
    await wait(2);
    img.style.opacity = 0;
    img = await createImg('img/img-2.jpg');
    console.log('Image 2 well loaded');
    await wait(2);
    img.style.opacity = 0;
  } catch (err) {
    console.error(err);
  }
};
//loadPause();

///2
const loadAll = async function (imgArr) {
  try {
    const imgs = imgArr.map(async d => await createImg(d));

    const el = await Promise.all(imgs);

    el.forEach(d => d.classList.add('Parallel'));
  } catch (err) {
    console.error(err);
  }
};
loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);
