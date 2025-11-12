const openBtn = document.getElementById('openSidebar');
const closeBtn = document.getElementById('closeSidebar');
const sidebarElement = document.getElementById('sidebar');
const contentElement = document.getElementById('content');

openBtn?.addEventListener('click', () => {
    sidebarElement.classList.add('active');
    contentElement.classList.add('active');
});

closeBtn?.addEventListener('click', () => {
    sidebarElement.classList.remove('active');
    contentElement.classList.remove('active');
});