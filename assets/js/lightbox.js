window.addEventListener('load', function() {
  document.querySelectorAll('.my-popup').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var img = document.getElementById('lightbox-img');
      var box = document.getElementById('lightbox');
      img.src = this.href;
      box.style.display = 'flex';
    });
  });
  document.getElementById('lightbox').addEventListener('click', function() {
    document.getElementById('lightbox').style.display = 'none';
  });
});
