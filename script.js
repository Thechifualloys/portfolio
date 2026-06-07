/**
 * Chiflloy Portfolio Script
 * Modernized & Optimized
 */

// Typing Effect for Hero Section
function initTypingEffect() {
    const title = document.querySelector('.typing');
    if (!title) return;

    const text = title.innerHTML;
    title.innerHTML = '';
    
    const arrText = text.split('');
    arrText.forEach((letra, i) => {
        setTimeout(() => {
            title.innerHTML += letra;
        }, 100 * i);
    });
}

// Modal Management
function initModal() {
    const modal = document.getElementById("modal");
    const contactBtn = document.getElementById("contactBtn");
    const closeBtn = document.querySelector(".close");

    if (!modal || !contactBtn) return;

    contactBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
}

// "Read More" Toggle Logic
function initReadMore() {
    const readMoreLink = document.getElementById('read-more-link');
    const collapseLink = document.getElementById('collapse-link');
    const hiddenContent = document.getElementById('hidden-paragraphs');

    if (!readMoreLink || !collapseLink || !hiddenContent) return;

    readMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        hiddenContent.classList.remove('hidden');
        collapseLink.classList.remove('hidden');
        readMoreLink.classList.add('hidden');
    });

    collapseLink.addEventListener('click', (e) => {
        e.preventDefault();
        hiddenContent.classList.add('hidden');
        collapseLink.classList.add('hidden');
        readMoreLink.classList.remove('hidden');
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.fa-bars');
    const navMenu = document.querySelector('header .navegacao-primaria');

    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('fa-x');
        navMenu.classList.toggle('ativado');
    });
}

// Experience & Education Tab Logic
function initTabs() {
    const experienceDivs = document.querySelectorAll('.experience_content div');
    const experienceDots = document.querySelectorAll('.experience_content ul li');
    const educationDivs = document.querySelectorAll('.education_content div');
    const educationDots = document.querySelectorAll('.education_content ul li');

    const setupTabs = (divs, dots) => {
        if (divs.length === 0 || dots.length === 0) return;
        
        // Set initial state
        divs[0].classList.add('active');
        dots[0].classList.add('active');

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                divs.forEach(div => div.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                divs[index].classList.add('active');
                dot.classList.add('active');
            });
        });
    };

    setupTabs(experienceDivs, experienceDots);
    setupTabs(educationDivs, educationDots);
}

// Project Filtering
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.projects_models ul li');
    const projectItems = document.querySelectorAll('.projects_storage ul li');

    if (filterButtons.length === 0 || projectItems.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update button active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.classList.contains('all') ? 'all' : 
                           button.classList.contains('design') ? 'design' : 'webSite';

            // Filter items
            projectItems.forEach(item => {
                if (category === 'all' || item.id === category) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    });

    // Show all projects initially
    projectItems.forEach(item => item.classList.add('active'));
}

// Initialize all features on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initModal();
    initReadMore();
    initMobileMenu();
    initTabs();
    initProjectFilter();

    // Auto-play hero video
    const video = document.getElementById('myVideo');
    if (video) {
        video.play().catch(error => console.log("Video auto-play failed:", error));
    }
});
