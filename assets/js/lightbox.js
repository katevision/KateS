window.addEventListener('load', function() {
  document.querySelectorAll('img.my-lightbox').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      document.getElementById('lightbox-img').src = this.src;
      document.getElementById('lightbox').style.display = 'flex';
    });
  });
  document.getElementById('lightbox').addEventListener('click', function() {
    this.style.display = 'none';
  });
  document.getElementById('lightbox-img').addEventListener('click', function(e) {
    e.stopPropagation();
  });
});
