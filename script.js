document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. MOBILE MENU TOGGLE
       ========================================= */
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('active');

            // Toggle icon between bars and times
            const icon = hamburger.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        }
    });

    /* =========================================
       1.5 DESKTOP SIDEBAR TOGGLE
       ========================================= */
    const desktopOpenBtn = document.getElementById('desktop-toggle-open');
    const desktopCloseBtn = document.getElementById('desktop-toggle-close');

    if (desktopOpenBtn && desktopCloseBtn) {
        desktopOpenBtn.addEventListener('click', () => {
            document.body.classList.remove('sidebar-collapsed');
        });
        
        desktopCloseBtn.addEventListener('click', () => {
            document.body.classList.add('sidebar-collapsed');
        });
    }

    /* =========================================
       2. SMOOTH SCROLLING
       ========================================= */
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu on click
            if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =========================================
       3. ACTIVE NAV STATE ON SCROLL
       ========================================= */
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* =========================================
       4. FADE-UP ANIMATION ON SCROLL
       ========================================= */
    const fadeElements = document.querySelectorAll('.fade-up');

    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Trigger visible class for elements already in viewport on load
    setTimeout(() => {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
                element.classList.add('visible');
            }
        });
    }, 100);

    /* =========================================
       5. PROJECT FILTERING
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // If filter is 'all', show all. Otherwise, check data-category.
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* =========================================
       6. PROJECT MODAL POPUP
       ========================================= */
    const modal = document.getElementById('projectModal');
    const closeModalBtn = document.querySelector('.close-modal');

    window.openProjectModal = (title, embedLink = '', openLink = '') => {
        document.querySelector('.project-modal-title').textContent = title;

        const iframe = document.querySelector('.project-iframe');
        const fallback = document.querySelector('.project-iframe-fallback');
        const loadingOverlay = modal.querySelector('.iframe-loading');
        const openBtn = document.querySelector('.project-open-btn');

        // Use openLink if provided, else embedLink as fallback for the button
        openBtn.href = openLink || embedLink || '#';
        openBtn.style.display = (openLink || embedLink) ? 'inline-flex' : 'none';

        if (embedLink) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.opacity = '1';
            fallback.style.display = 'none';
            iframe.style.display = 'block';
            iframe.src = embedLink;

            const onLoad = () => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => { loadingOverlay.style.display = 'none'; }, 400);
                iframe.removeEventListener('load', onLoad);
            };
            iframe.addEventListener('load', onLoad);
        } else {
            // No embed — show clean fallback message
            iframe.src = '';
            iframe.style.display = 'none';
            loadingOverlay.style.display = 'none';
            fallback.style.display = 'block';
            fallback.textContent = 'Klik tombol di bawah untuk membuka proyek ini di tab baru.';
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        document.querySelector('.project-iframe').src = '';
    };

    // Close on X button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    /* =========================================
       6. PUBLICATION MODAL POPUP
       ========================================= */
    const pubModal = document.getElementById('pubModal');
    const pubCloseBtn = document.querySelector('.pub-close-modal');

    window.openPubModal = (title, source, date, link, regNumber = null, imageSrc = null) => {
        document.querySelector('.pub-title').textContent = title;
        document.querySelector('.pub-modal-source').textContent = source;
        document.querySelector('.pub-modal-date').textContent = date;

        const regElem = document.querySelector('.pub-reg-number');
        if (regNumber) {
            regElem.textContent = 'Registration Number: ' + regNumber;
            regElem.style.display = 'block';
        } else {
            regElem.style.display = 'none';
        }

        const iframe = pubModal.querySelector('.pub-iframe');
        const fallback = pubModal.querySelector('.iframe-fallback');
        const imgEmbed = pubModal.querySelector('.pub-image-embed');
        const loadingOverlay = pubModal.querySelector('.iframe-loading');

        if (imageSrc) {
            imgEmbed.src = imageSrc;
            imgEmbed.style.display = 'block';
            iframe.style.display = 'none';
            fallback.style.display = 'none';
            loadingOverlay.style.display = 'none';
        } else {
            // Show loading spinner
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.opacity = '1';
            fallback.style.display = 'none';
            imgEmbed.style.display = 'none';
            iframe.style.display = 'block';
            iframe.src = link;

            // Hide spinner when iframe loads
            const onLoad = () => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => { loadingOverlay.style.display = 'none'; }, 400);
                // If iframe content is blocked, show fallback
                try {
                    if (!iframe.contentDocument || iframe.contentDocument.body.innerHTML === '') {
                        fallback.style.display = 'block';
                    }
                } catch (e) {
                    // Cross-origin: assume loaded
                }
                iframe.removeEventListener('load', onLoad);
            };
            iframe.addEventListener('load', onLoad);
        }

        document.querySelector('.pub-open-btn').href = link;

        pubModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    const closePubModal = () => {
        pubModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        document.querySelector('.pub-iframe').src = ''; // Clear iframe
        document.querySelector('.pub-image-embed').src = ''; // Clear image
    };

    if (pubCloseBtn) {
        pubCloseBtn.addEventListener('click', closePubModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === pubModal) closePubModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pubModal.classList.contains('show')) closePubModal();
    });

});
