$(function(){

  var whiteboard = new Firebase('https://onlinewhiteboard.firebaseio.com/');

  whiteboard.on('value', function(snapshot){
    console.log(snapshot.val());
    var img = new Image;
    img.onload = function(){
      ctx.drawImage(img,0,0); // Or at whatever offset you like
    };
    var data = snapshot.val();
    img.src = data.context;
  });


  var canvas = document.querySelector('#paint');
  var ctx = canvas.getContext('2d');

  var sketch = document.querySelector('#sketch');
  var sketch_style = getComputedStyle(sketch);
  canvas.width = parseInt(sketch_style.getPropertyValue('width'));
  canvas.height = parseInt(sketch_style.getPropertyValue('height'));

  var mouse = {x: 0, y: 0};

  /* Mouse Capturing Work */
  canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  }, false);


    /* Drawing on Paint App */
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'red';

  canvas.addEventListener('mousedown', function(e) {
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);

      canvas.addEventListener('mousemove', onPaint, false);
  }, false);

  canvas.addEventListener('mouseup', function() {
      canvas.removeEventListener('mousemove', onPaint, false);
  }, false);

  var onPaint = function() {
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();

      var data = canvas.toDataURL();
      whiteboard.child('context').set(data, onComplete);
  };

  var onComplete = function(error){
    if(error)
      console.log(error)
  };

});
