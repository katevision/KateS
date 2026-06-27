console.log('lightbox.js loaded');

window.addEventListener('load', function() {
  console.log('window loaded');
  document.querySelectorAll('img.my-lightbox').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('click fired', this.src);
      document.getElementById('lightbox-img').src = this.src;
      document.getElementById('lightbox').style.display = 'flex';
    }, true);
  });
  document.getElementById('lightbox').addEventListener('click', function() {
    this.style.display = 'none';
  });
  document.getElementById('lightbox-img').addEventListener('click', function(e) {
    e.stopPropagation();
  });
});
