'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const headingSection1 = document.querySelector('.section__header');
const allSections = document.querySelectorAll('.section');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////

//?    showing navbar
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//?  lazy loading section
const lazyloading = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(lazyloading, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//? lazy loading imgs

const allImages = document.querySelectorAll('img[data-src]');

const imgLoading = (entries, observer) => {
  entries.forEach(entry => {
    //
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
  });
};

const imgObserver = new IntersectionObserver(imgLoading, {
  root: null,
  threshold: 0.2,
});

allImages.forEach(img => {
  //
  imgObserver.observe(img);
});

///? Slider

// declaring variables

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');

//creating functions

const defaultActiveDot = () => {
  dotContainer.querySelectorAll('.dots__dot').forEach((d, i) => {
    if (i === 0) {
      d.classList.add('dots__dot--active');
    }
  });
};
const removeActiveDot = () => {
  dotContainer
    .querySelectorAll('.dots__dot')
    .forEach(d => d.classList.remove('dots__dot--active'));
};

const activeDote = slide => {
  document.querySelectorAll('.dots__dot').forEach(d => {
    if (d.dataset.slide == slide) {
      d.classList.add('dots__dot--active');
    }
  });
};

const nextSlide = () => {
  removeActiveDot();
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  activeDote(curSlide);

  moveSlide(curSlide);
};

const prevSlide = () => {
  removeActiveDot();
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  activeDote(curSlide);

  moveSlide(curSlide);
};

function moveSlide(slideValue) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - slideValue)}%)`;
  });
}

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

// calling functions default

moveSlide(0);
createDots();
defaultActiveDot();

// adding event listeners

btnRight.addEventListener('click', () => {
  nextSlide();
});

btnLeft.addEventListener('click', () => {
  prevSlide();
});

document.addEventListener('keydown', e => {
  if (e.key == 'ArrowRight') {
    nextSlide();
  } else if (e.key == 'ArrowLeft') {
    prevSlide();
  }
});

dotContainer.addEventListener('click', e => {
  removeActiveDot();

  if (e.target.classList.contains('dots__dot')) {
    let { slide } = e.target.dataset;
    moveSlide(slide);
    activeDote(slide);
  }
});

//? fading links in navbar

const allListItems = nav
  .querySelector('.nav__links')
  .querySelectorAll('.nav__item');
const logo = document.querySelector('#logo');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(s => {
      if (s !== link) {
        s.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//operation Container

const operations__tab = document.querySelector('.operations__tab-container');
const operations__content = document.querySelectorAll('.operations__content');

operations__tab.addEventListener('click', e => {
  if (e.target.closest('.btn').classList.contains('operations__tab')) {
    const currentBtn = e.target.closest('.btn');
    const curBtnDataset = currentBtn.dataset.tab;
    const btnSiblings = currentBtn
      .closest('.operations')
      .querySelectorAll('button');

    btnSiblings.forEach(btn => {
      btn.classList.remove('operations__tab--active');
    });
    currentBtn.classList.add('operations__tab--active');

    operations__content.forEach(curCon => {
      curCon.classList.remove('operations__content--active');
      if (curCon.classList.contains(`operations__content--${curBtnDataset}`)) {
        curCon.classList.add('operations__content--active');
      }
    });
  }
});
