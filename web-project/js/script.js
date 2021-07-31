const navBtn = document.querySelector('.navbar-toggler');
const menuToggle = document.getElementById('navbarNavAltMarkup');
const bsCollapse = new bootstrap.Collapse(menuToggle);

navBtn.addEventListener('blur', function(event) {
let screenWidth = window.innerWidth;
if (screenWidth < 992) {
    bsCollapse.hide();
}
});
