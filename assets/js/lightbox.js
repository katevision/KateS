window.addEventListener('load', function() {
  document.querySelectorAll('.my-lightbox').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('lightbox-img').src = this.dataset.src;
      document.getElementById('lightbox').style.display = 'flex';
    });
  });
  document.getElementById('lightbox').onclick = function() {
    this.style.display = 'none';
  };
  document.getElementById('lightbox-img').onclick = function(e) {
    e.stopPropagation();
  };
});
