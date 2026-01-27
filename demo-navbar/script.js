// Get elements
const sidebar = document.getElementById('sidebar');
const navTrigger = document.querySelector('.nav-trigger');

// Show sidebar when cursor enters trigger zone (left edge)
navTrigger.addEventListener('mouseenter', () => {
  sidebar.classList.add('visible');
});

// Keep sidebar visible when hovering over it
sidebar.addEventListener('mouseenter', () => {
  sidebar.classList.add('visible');
});

// Hide sidebar when cursor leaves the sidebar
sidebar.addEventListener('mouseleave', () => {
  sidebar.classList.remove('visible');
});

// Also handle mousemove for smoother experience
document.addEventListener('mousemove', (e) => {
  const triggerZone = 30; // pixels from left edge
  
  if (e.clientX <= triggerZone) {
    sidebar.classList.add('visible');
  }
});

// Handle nav item clicks
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  item.addEventListener('click', function(e) {
    // Remove active class from all items
    navItems.forEach(i => i.classList.remove('active'));
    // Add active class to clicked item
    this.classList.add('active');
  });
});

// Optional: Add keyboard shortcut (press 'M' to toggle menu)
document.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') {
    sidebar.classList.toggle('visible');
  }
});
