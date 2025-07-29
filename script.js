document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTS ---
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const allNavLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section');
    const fileCards = document.querySelectorAll('.file-card');
    const accordionButtons = document.querySelectorAll('.accordion-button');

    // --- BACKGROUND IMAGE ROTATION ---
    const backgroundImages = [
        'images/bg1.jpg',
        'images/bg2.jpg',
        'images/bg3.jpg',
        'images/bg4.jpg',
        'images/bg5.jpg',
        'images/bg6.jpg'
    ];

    console.log('Background images array:', backgroundImages);

    // Preload images for smooth transitions
    backgroundImages.forEach((imageSrc, index) => {
        const img = new Image();
        img.onload = () => console.log(`Image ${index + 1} loaded successfully: ${imageSrc}`);
        img.onerror = () => console.error(`Failed to load image ${index + 1}: ${imageSrc}`);
        img.src = imageSrc;
    });

    let currentImageIndex = 0;

    const rotateBackground = () => {
        console.log('Setting background to:', backgroundImages[currentImageIndex]);
        document.body.style.backgroundImage = `url('${backgroundImages[currentImageIndex]}')`;
        currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    };

    // Set initial background
    rotateBackground();

    setInterval(rotateBackground, 120000);

    // --- HAMBURGER MENU LOGIC ---
    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            const isOpening = !navLinksContainer.classList.contains('active');
            navLinksContainer.classList.toggle('active');

            // If the menu is being CLOSED, find any open dropdowns and close them too
            if (!isOpening) {
                const openDropdowns = navLinksContainer.querySelectorAll('.dropdown-content.open');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
    }

    // --- DROPDOWN LOGIC ---
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
        });
    });

    // --- SECTION TOGGLING LOGIC ---
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

    // --- NAVIGATION LINK CLICK LOGIC ---
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const isDropdownButton = link.classList.contains('dropbtn');

            // Skip dropdown buttons - they're handled by the dropdown logic above
            if (isDropdownButton) return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const parentSection = targetElement.closest('main section');
                showSection(parentSection ? parentSection.id : targetId);
                if (parentSection) targetElement.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo(0, 0);
            }

            // Close hamburger menu if it's open AND close any open dropdowns
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                
                // Also close any open dropdowns when a link is clicked
                const openDropdowns = navLinksContainer.querySelectorAll('.dropdown-content.open');
                openDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
    });

    // --- FILE CARD CLICK LOGIC ---
    fileCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(card.getAttribute('href').substring(1));
            window.scrollTo(0, 0);
        });
    });

    // --- BIOGRAPHY ACCORDION LOGIC ---
    accordionButtons.forEach(button => {
        // Set initial state: mark all buttons as active (open)
        button.classList.add('active');
        
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                // Opening the panel
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                // Closing the panel
                panel.style.maxHeight = "0px";
            }
        });
    });

    // --- INITIAL PAGE LOAD LOGIC ---
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
});