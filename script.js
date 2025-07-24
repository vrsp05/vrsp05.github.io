document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section');

    // --- Hamburger Menu Logic ---
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }

    // --- File Card Click Logic ---
    const fileCards = document.querySelectorAll('.file-card');
    fileCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = card.getAttribute('href').substring(1);
            showSection(targetId);
            window.scrollTo(0, 0);
        });
    });

    // --- Section Toggling Logic ---
    const showSection = (sectionId) => {
        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Update the active class on the navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // Add click listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Add this check to ignore clicks on dropdown triggers
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const sectionId = href.substring(1);

            // If it's a sub-link, just scroll to it
            if (href.includes('-sub')) {
                const targetElement = document.getElementById(sectionId);
                if (targetElement) {
                    showSection('about'); // Make sure the parent 'about' section is visible
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Otherwise, show the main section
                e.preventDefault(); // Stop default scroll for main sections
                showSection(sectionId);
                window.scrollTo(0, 0); // Scroll to top of the new section
            }

            // Close the hamburger menu if it's open
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // --- Initial Page Load ---
    // Show the first section by default when the page loads
    if (sections.length > 0) {
        const firstSectionId = sections[0].id;
        showSection(firstSectionId);
    }
});