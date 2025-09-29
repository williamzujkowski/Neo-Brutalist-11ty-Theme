// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isActive = navLinks.classList.contains('active');

            // Toggle the active class
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Update aria-expanded
            navToggle.setAttribute('aria-expanded', !isActive);

            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'auto' : 'hidden';
        });

        // Close menu when clicking on a link
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        });
    }
});