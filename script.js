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

  // --- FORM SUBMISSION (with Formspree) ---
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default page reload

        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        const formData = new FormData(form);

        // Update button state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // Success!
                submitBtn.textContent = 'Message Sent!';
                setTimeout(() => { // Give user a moment to see the success message
                   submitBtn.textContent = originalBtnText;
                   submitBtn.disabled = false;
                }, 2000);
                form.reset(); // Clear the form fields
            } else {
                // Error from the server
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Oops! There was a problem submitting your form.');
                    }
                    // Restore button on error
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
            }
        }).catch(error => {
            // Network error
            alert('Oops! There was a problem with the network. Please try again.');
            // Restore button on error
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}


});