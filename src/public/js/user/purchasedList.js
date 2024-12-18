import { showToast, showModal } from '../common.js';

function 


document.getElementById('images').addEventListener('change', function (event) {
  var preview = document.getElementById('imagePreview');
  preview.innerHTML = '';
  for (var i = 0; i < event.target.files.length; i++) {
    var file = event.target.files[i];
    var img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  }
});

document.addEventListener('DOMContentLoaded', function () {


});
