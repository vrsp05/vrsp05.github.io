document.addEventListener('DOMContentLoaded', () => {
    // --- HAMBURGER MENU LOGIC (RUNS ON ALL PAGES) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    console.log('Script loaded. Page:', document.body.className || 'no class');
    console.log('Hamburger found:', !!hamburger);
    console.log('Nav container found:', !!navLinksContainer);

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            console.log('Hamburger clicked!');
            console.log('Nav container classes before:', navLinksContainer.className);
            
            navLinksContainer.classList.toggle('active');
            
            console.log('Nav container classes after:', navLinksContainer.className);

            // If the menu is being closed, also close any open mobile sub-menus
            if (!navLinksContainer.classList.contains('active')) {
                const openDropdowns = navLinksContainer.querySelectorAll('.dropdown-content.open');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
    }

    // --- DROPDOWN LOGIC (WORKS ON ALL PAGES) ---
    const dropdownButtons = document.querySelectorAll('.dropbtn');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const isMobile = window.getComputedStyle(hamburger).display !== 'none';
            
            // On mobile, toggle the dropdown
            if (isMobile) {
                e.preventDefault();
                e.stopPropagation();
                const dropdownContent = button.nextElementSibling;
                if (dropdownContent) {
                    dropdownContent.classList.toggle('open');
                }
            }
            // On desktop, dropdowns work with CSS hover, so we don't need to do anything
        });
    });

    // --- LOGIC FOR PORTFOLIO PAGE ONLY ---
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const allNavLinks = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('main section');
        const fileCards = document.querySelectorAll('.file-card');
        const accordionButtons = document.querySelectorAll('.accordion-button');

        // --- Section Toggling Logic ---
        const showSection = (sectionId) => {
            sections.forEach(section => section.style.display = 'none');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            allNavLinks.forEach(nav => nav.classList.remove('active-link'));
            const activeLink = document.querySelector(`a[href="#${sectionId.split('-')[0]}"]`);
            if (activeLink) activeLink.classList.add('active-link');
        };

        // --- Navigation Link Click Logic ---
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href.startsWith('#')) return;

                e.preventDefault();
                const isDropdownButton = link.classList.contains('dropbtn');

                // Skip dropdown buttons - they're handled by the general dropdown logic above
                if (isDropdownButton) return;

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const parentSection = targetElement.closest('main section');
                    showSection(parentSection ? parentSection.id : targetId);
                    if (parentSection) targetElement.scrollIntoView({ behavior: 'smooth' });
                    else window.scrollTo(0, 0);
                }

                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                }
            });
        });

        // --- File Card Click Logic ---
        fileCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(card.getAttribute('href').substring(1));
                window.scrollTo(0, 0);
            });
        });

        // --- Biography Accordion Logic ---
        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                const panel = this.nextElementSibling;
                panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
            });
        });

        // --- Initial Page Load Logic ---
        const handleInitialLoad = () => {
            const hash = window.location.hash;
            if (hash) {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const parentSection = targetElement.closest('main section');
                    if (parentSection) {
                        showSection(parentSection.id);
                        setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                        return;
                    }
                }
            }
            showSection('about');
        };

        handleInitialLoad();
    }
});