/**
 * Chiflloy Portfolio Script
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Ambient cyber network background
function initBackgroundNetwork() {
    const canvas = document.getElementById('bgNetwork');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, nodes;
    const LINK_DIST = 150;
    const NODE_COLOR = 'rgba(1, 238, 255, 0.55)';

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        const density = Math.min(70, Math.floor((width * height) / 22000));
        nodes = Array.from({ length: density }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25
        }));
    };

    const drawStatic = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = NODE_COLOR;
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const step = () => {
        ctx.clearRect(0, 0, width, height);

        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DIST) {
                    ctx.strokeStyle = `rgba(1, 238, 255, ${0.16 * (1 - dist / LINK_DIST)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        ctx.fillStyle = NODE_COLOR;
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(step);
    };

    resize();

    if (prefersReducedMotion) {
        drawStatic();
        window.addEventListener('resize', () => { resize(); drawStatic(); });
        return;
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
    });

    requestAnimationFrame(step);
}

// Mobile menu
function initMobileMenu() {
    const nav = document.getElementById('site-nav');
    const toggle = document.getElementById('menuToggle');
    const links = document.querySelectorAll('.primary-nav a, .nav-cta');

    if (!nav || !toggle) return;

    const closeMenu = () => {
        nav.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('mobile-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('mobile-open') && !nav.contains(e.target)) {
            closeMenu();
        }
    });
}

// Scrollspy: highlight active nav link based on visible section
function initScrollSpy() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.primary-nav a');
    if (!sections.length || !navLinks.length) return;

    const linkFor = (id) => document.querySelector(`.primary-nav a[href="#${id}"]`);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const activeLink = linkFor(entry.target.id);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}

// Reveal-on-scroll animations
function initRevealOnScroll() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion) {
        items.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(el => observer.observe(el));
}

// "Read More" toggle
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

// Hero terminal: simulated command sequence
function initTerminal() {
    const body = document.getElementById('terminalBody');
    if (!body) return;

    const sequence = [
        { cmd: 'whoami', out: 'alloys-chifu — backend & systems engineer' },
        { cmd: 'cat stack.txt', out: 'node.js · python · postgresql · mongodb' },
        { cmd: 'git log -1 --oneline', out: 'building reliable systems, one commit at a time.' }
    ];

    const render = () => {
        body.innerHTML = '';
        sequence.forEach(step => {
            const line = document.createElement('p');
            line.className = 'terminal-line';
            line.innerHTML = `<span class="prompt">$</span><span class="cmd">${step.cmd}</span>`;
            const out = document.createElement('p');
            out.className = 'terminal-out';
            out.textContent = step.out;
            body.appendChild(line);
            body.appendChild(out);
        });
        const promptLine = document.createElement('p');
        promptLine.className = 'terminal-line';
        promptLine.innerHTML = `<span class="prompt">$</span><span class="cursor"></span>`;
        body.appendChild(promptLine);
    };

    if (prefersReducedMotion) {
        render();
        return;
    }

    let i = 0;
    const typeNext = () => {
        if (i >= sequence.length) {
            const promptLine = document.createElement('p');
            promptLine.className = 'terminal-line';
            promptLine.innerHTML = `<span class="prompt">$</span><span class="cursor"></span>`;
            body.appendChild(promptLine);
            return;
        }
        const step = sequence[i];
        const line = document.createElement('p');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">$</span><span class="cmd"></span>`;
        body.appendChild(line);
        const cmdEl = line.querySelector('.cmd');

        let c = 0;
        const typeChar = setInterval(() => {
            cmdEl.textContent += step.cmd[c];
            c++;
            if (c >= step.cmd.length) {
                clearInterval(typeChar);
                setTimeout(() => {
                    const out = document.createElement('p');
                    out.className = 'terminal-out';
                    out.textContent = step.out;
                    body.appendChild(out);
                    i++;
                    setTimeout(typeNext, 450);
                }, 250);
            }
        }, 35);
    };

    typeNext();
}

// Footer year
function initFooterYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

// Contact form: async submit with inline success/error feedback
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('cf-status');
    const submitBtn = document.getElementById('cf-submit');
    if (!form || !status || !submitBtn) return;

    // Only flag a field as invalid after the visitor has actually left it,
    // never on first render or while they're still typing.
    ['name', 'email', 'message'].forEach((fieldName) => {
        const field = form[fieldName];
        if (!field) return;
        field.addEventListener('blur', () => {
            field.classList.toggle('field-invalid', field.value.trim() !== '' && !field.checkValidity());
        });
        field.addEventListener('input', () => {
            if (field.classList.contains('field-invalid') && field.checkValidity()) {
                field.classList.remove('field-invalid');
            }
        });
    });

    const btnLabel = submitBtn.querySelector('.btn-label');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        status.textContent = '';
        status.className = 'form-status';

        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim(),
            website: form.website.value
        };

        if (!data.name || !data.email || data.message.length < 10) {
            status.textContent = 'Please fill in your name, a valid email, and a message of at least 10 characters.';
            status.className = 'form-status error';
            return;
        }

        submitBtn.disabled = true;
        if (btnLabel) btnLabel.textContent = 'Sending...';

        try {
            const res = await fetch('contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json().catch(() => null);

            if (res.ok && result && result.success) {
                status.textContent = "Message sent — I'll get back to you soon.";
                status.className = 'form-status success';
                form.reset();
            } else {
                status.textContent = (result && result.error) || 'Something went wrong. Please try again or email me directly.';
                status.className = 'form-status error';
            }
        } catch (err) {
            status.textContent = "Couldn't reach the server. Please try again or email me directly.";
            status.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            if (btnLabel) btnLabel.textContent = 'Send Message';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initBackgroundNetwork();
    initMobileMenu();
    initScrollSpy();
    initRevealOnScroll();
    initReadMore();
    initTerminal();
    initFooterYear();
    initContactForm();
});
