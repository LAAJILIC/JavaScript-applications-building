'use strict';
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sec1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1 = sec1.getBoundingClientRect();
  console.log(s1);
  console.log(e.target.getBoundingClientRect());
  console.log(
    'Current scroll dimensions X/Y',
    window.pageXOffset,
    window.pageYOffset
  );
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  sec1.scrollIntoView({ behavior: 'smooth' });
});
///scrrolling by touching : The intersection observer API

const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};
const obsOptions = {
  root: null,
  threshold: [0, 0.3],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(sec1);

// reveal sections
const allSecs = document.querySelectorAll('.section');
const revealSec = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('.section--hidden');
  observer.unobserve(entry.target);
};
const secObserver = new IntersectionObserver(revealSec, {
  root: null,
  threshold: 0.15,
});

allSecs.forEach(function (sec) {
  secObserver.observe(sec);
  // sec.classList.add('section--hidden');
});
////////////////// Event propagation
const randomInt = (mi, ma) => Math.floor(Math.random() * (ma - mi + 1) + mi);
const randomColor = () =>
  `rgb(${randomInt(0, 225)},${randomInt(0, 225)},${randomInt(0, 225)})`;
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // stop propagation e.stopPropagation();
});
// bubbling phase
//document.querySelector('.nav__links').addEventListener('click', function (e) {
// this.style.backgroundColor = randomColor();});
// capturing phase
//document.querySelector('.nav').addEventListener('click',function (e) {this.style.backgroundColor = randomColor(); }, true);
///////////////////////
////////////////////Page navigation
///Event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //const id = this.getAttribute('href');
  if (
    e.target.classList.contains('nav__link') &&
    e.target.getAttribute('href').length < 2
  ) {
    e.preventDefault();
    e.href = '#section--3';
    document.querySelector(e.href).scrollIntoView();
  }
});

//DOM traversing
// downwards : child
const h1 = document.querySelector('h1');
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'orangered';
// upwards : parent
console.log(h1.parentNode);
console.log(h1.parentElement);

// sideways
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (elt) {
  if (elt !== h1) elt.style.transform = 'scale(1)';
});

//Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab & content area
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//////////////////////////////
// Lazy images loading(let's think about people having pure internet connection or not well performing devices)
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObs = new IntersectionObserver(loadImg, { root: null, threshold: 0 });

imgTargets.forEach(img => imgObs.observe(img));

// Menu fade animation
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// slider component
let curSlide = 0;

const slides = document.querySelectorAll('.slide');
const maxSlides = slides.length;

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slid = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const activDot = function (slid) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dots--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slid}"]`)
    .classList.add('dots__dot--active');
};
activDot(0);
const goToSlide = function (slid) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slid)}%)`)
  );
};
goToSlide(0);
const nextS = function () {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else curSlide++;
  goToSlide(curSlide);
  activDot(curSlide);
};
const prevS = function () {
  if (curSlide === 0) {
    curSlide = maxSlides - 1;
  } else curSlide--;
  goToSlide(curSlide);
  activDot(curSlide);
};
btnRight.addEventListener('click', nextS);
btnLeft.addEventListener('click', prevS);
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowRight' && nextS();
  //e.key === 'ArrowLeft' && prevS();
});
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activDot(curSlide);
  }
});
