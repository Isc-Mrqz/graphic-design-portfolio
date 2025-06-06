const carousels = document.querySelectorAll('.carousel-container');
const posts = {};

// Initialize each carousel
carousels.forEach(container => {
  const postId = container.dataset.post;
  const track = container.querySelector('.carousel-track');
  const images = track.children.length;
  const dotsContainer = document.querySelector(`.dots[data-dots="${postId}"]`);
  let currentIndex = 0;

  // Store each post's carousel state
  posts[postId] = { track, currentIndex, images, dotsContainer };

  // Create dots for this carousel
  for (let i = 0; i < images; i++) {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => goToSlide(postId, i));
    dotsContainer.appendChild(dot);
  }

  updateDots(postId);

  // Arrow buttons event listeners
  container.querySelector('.arrow.left').addEventListener('click', () => prevSlide(postId));
  container.querySelector('.arrow.right').addEventListener('click', () => nextSlide(postId));

  // --- Swipe gesture support ---
  let startX = 0;
  let endX = 0;
  const threshold = 50; // Minimum swipe distance in px

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchmove', e => {
    endX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', () => {
    const distance = endX - startX;
    if (distance > threshold) {
      prevSlide(postId); // Swipe right -> previous slide
    } else if (distance < -threshold) {
      nextSlide(postId); // Swipe left -> next slide
    }
    startX = 0;
    endX = 0;
  });
});

function updateCarousel(postId) {
  const { track, currentIndex } = posts[postId];
  track.style.transform = `translateX(-${100 * currentIndex}%)`;
  updateDots(postId);
}

function updateDots(postId) {
  const { dotsContainer, currentIndex } = posts[postId];
  const dots = dotsContainer.querySelectorAll('span');
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[currentIndex]) dots[currentIndex].classList.add('active');
}

function nextSlide(postId) {
  const post = posts[postId];
  if (post.currentIndex < post.images - 1) {
    post.currentIndex++;
    updateCarousel(postId);
  }
}

function prevSlide(postId) {
  const post = posts[postId];
  if (post.currentIndex > 0) {
    post.currentIndex--;
    updateCarousel(postId);
  }
}

function goToSlide(postId, index) {
  posts[postId].currentIndex = index;
  updateCarousel(postId);
}





document.getElementById('fullscreenBtn').addEventListener('click', function () {
  const video = document.getElementById('phoneVideo');
  const videoSrc = video.querySelector('source').src;

  // Pause the background video
  video.pause();

  // Create a new fullscreen video element
  const fullScreenVideo = document.createElement('video');
  fullScreenVideo.src = videoSrc;
  fullScreenVideo.controls = true;
  fullScreenVideo.autoplay = true;
  fullScreenVideo.style.position = 'fixed';
  fullScreenVideo.style.top = '0';
  fullScreenVideo.style.left = '0';
  fullScreenVideo.style.width = '100%';
  fullScreenVideo.style.height = '100%';
  fullScreenVideo.style.zIndex = '9999';
  fullScreenVideo.style.backgroundColor = 'black';

  document.body.appendChild(fullScreenVideo);
  fullScreenVideo.requestFullscreen?.();

  // Exit fullscreen and remove video when done
  fullScreenVideo.addEventListener('ended', () => {
    fullScreenVideo.remove();
    document.exitFullscreen?.();
  });

  fullScreenVideo.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      fullScreenVideo.pause();
      fullScreenVideo.remove();
    }
  });
});
