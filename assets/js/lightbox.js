window.addEventListener('load', function() {
  document.querySelectorAll('.my-lightbox').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('lightbox-img').src = this.href;
      document.getElementById('lightbox').style.display = 'flex';
    });
  });
  document.getElementById('lightbox').addEventListener('click', function() {
    document.getElementById('lightbox').style.display = 'none';
  });
  document.getElementById('lightbox-img').addEventListener('click', function(e) {
    e.stopPropagation();
  });
});
