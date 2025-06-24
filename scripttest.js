// Wait for the entire HTML document to be loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

  // --- SMOOTH SCROLLING & ACTIVE NAV LINK ---
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
          
          const targetId = this.getAttribute('href');
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth' });
          }
      });
  });

  // --- NAVBAR BACKGROUND ON SCROLL ---
  window.addEventListener('scroll', function() {
      const nav = document.querySelector('nav');
      if (window.scrollY > 50) {
          nav.style.background = 'rgba(26, 26, 26, 0.98)';
          nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)'; // Added a subtle shadow
      } else {
          nav.style.background = 'rgba(26, 26, 26, 0.95)';
          nav.style.boxShadow = 'none';
      }
  });

  // --- CAROUSEL FUNCTIONALITY ---
  const track = document.querySelector('.cards-container');
  const nextButton = document.querySelector('.carousel-btn.next');
  const prevButton = document.querySelector('.carousel-btn.prev');

  // Safety check: only run carousel code if elements exist
  if (track && nextButton && prevButton) {
      const slides = Array.from(track.children);
      let currentIndex = 0;

      const updateCarousel = () => {
          if (slides.length === 0) return; // Don't run if there are no slides

          const slideWidth = slides[0].getBoundingClientRect().width;
          const gap = parseInt(window.getComputedStyle(track).gap) || 0;
          const moveAmount = (slideWidth + gap) * currentIndex;
          
          track.style.transform = `translateX(-${moveAmount}px)`;

          // Disable/Enable buttons
          prevButton.disabled = currentIndex === 0;
          // Check if the end of the track is visible
          const viewportWidth = track.parentElement.getBoundingClientRect().width;
          const trackWidth = track.scrollWidth;
          nextButton.disabled = moveAmount >= trackWidth - viewportWidth - 1; // -1 for precision
      };

      nextButton.addEventListener('click', () => {
          // Check if there are more slides to show before moving
          const viewportWidth = track.parentElement.getBoundingClientRect().width;
          const trackWidth = track.scrollWidth;
          const moveAmount = (slides[0].getBoundingClientRect().width + parseInt(window.getComputedStyle(track).gap)) * currentIndex;

          if (moveAmount < trackWidth - viewportWidth) {
              currentIndex++;
              updateCarousel();
          }
      });

      prevButton.addEventListener('click', () => {
          if (currentIndex > 0) {
              currentIndex--;
              updateCarousel();
          }
      });

      // Recalculate on window resize
      window.addEventListener('resize', () => {
           // Resetting to start is the safest way to handle resize
           currentIndex = 0;
           updateCarousel();
      });
      
      // Initial setup for the carousel
      updateCarousel();
  }


  // --- INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ---
  // First, set initial styles using CSS for better performance
  // Add this to your CSS file:
  // .section, .card, .timeline-item {
  //     opacity: 0;
  //     transform: translateY(30px);
  //     transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  // }
  // .section.is-visible, .card.is-visible, .timeline-item.is-visible {
  //     opacity: 1;
  //     transform: translateY(0);
  // }

  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');

              // Animate cards with a delay
              const cards = entry.target.querySelectorAll('.card');
              cards.forEach((card, index) => {
                  card.style.transitionDelay = `${index * 150}ms`;
                  card.classList.add('is-visible');
              });
              
              // Animate timeline items with a delay
              const timelineItems = entry.target.querySelectorAll('.timeline-item');
              timelineItems.forEach((item, index) => {
                 item.style.transitionDelay = `${index * 150}ms`;
                 item.classList.add('is-visible');
              });
              
              // Stop observing the element once it's visible
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });

  // Observe all sections for the fade-in effect
  document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
  });

  // --- FORM SUBMISSION ---
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const submitBtn = this.querySelector('.submit-btn');
          const originalText = submitBtn.textContent;
          
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
          
          setTimeout(() => {
              alert('Thank you for your message! I\'ll get back to you soon.');
              this.reset();
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
          }, 1500);
      });
  }

  // --- CV DOWNLOAD ---
  const cvButton = document.querySelector('.cv-btn');
  if (cvButton) {
      cvButton.addEventListener('click', () => {
          alert('CV download feature would be implemented here. This would typically link to a PDF file.');
          // Example: window.open('path/to/your-cv.pdf', '_blank');
      });
  }
});