'use strict';
const modals = document.querySelectorAll('.modal');
const overlay = document.querySelector('.overlay');
const btnsCloseModal = document.querySelectorAll('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

for (let i = 0; i < btnsOpenModal.length; i++) {
  const openModal = function () {
    modals[i].classList.remove('hidden'); // without . (it's not a selector here)
    overlay.classList.remove('hidden'); // change the appearence of website
  };
  const closeModal = function () {
    modals[i].classList.add('hidden');
    overlay.classList.add('hidden');
  };
  btnsOpenModal[i].addEventListener('click', openModal);
  btnsCloseModal[i].addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (x) {
    console.log(x.key);
    if (x.key === 'Escape' && !modals[i].classList.contains('hidden'))
      closeModal();
  });
}
