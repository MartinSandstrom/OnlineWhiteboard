$(function(){

    var whiteboard = new Firebase('https://onlinewhiteboard.firebaseio.com/');
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    var mouse = {x: 0, y: 0};

    var onPaint = function() {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();

        whiteboard.child('context').set(canvas.toDataURL(), onComplete);
    };

    var onComplete = function(error){
        if(error)
          console.log(error)
    };

    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'red';

    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    whiteboard.on('value', function(snapshot){
        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        var data = snapshot.val();
        img.src = data.context;
    });


    var is_touch_device = 'ontouchstart' in document.documentElement;

     if (is_touch_device) {
        // create a drawer which tracks touch movements
        var drawer = {
           isDrawing: false,
           touchstart: function (coors) {
              context.beginPath();
              context.moveTo(coors.x, coors.y);
              this.isDrawing = true;
           },
           touchmove: function (coors) {
              if (this.isDrawing) {
                 context.lineTo(coors.x, coors.y);
                 context.stroke();
              }
           },
           touchend: function (coors) {
              if (this.isDrawing) {
                 this.touchmove(coors);
                 this.isDrawing = false;
              }
           }
        };

        // create a function to pass touch events and coordinates to drawer
        function draw(event) {

           // get the touch coordinates.  Using the first touch in case of multi-touch
           var coors = {
              x: event.targetTouches[0].pageX,
              y: event.targetTouches[0].pageY
           };

           // Now we need to get the offset of the canvas location
           var obj = sigCanvas;

           if (obj.offsetParent) {
              // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
              do {
                 coors.x -= obj.offsetLeft;
                 coors.y -= obj.offsetTop;
              }
		  // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
		  // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
              while ((obj = obj.offsetParent) != null);
           }

           // pass the coordinates to the appropriate handler
           drawer[event.type](coors);
        }


        // attach the touchstart, touchmove, touchend event listeners.
        canvas.addEventListener('touchstart', draw, false);
        canvas.addEventListener('touchmove', draw, false);
        canvas.addEventListener('touchend', draw, false);

        // prevent elastic scrolling
        canvas.addEventListener('touchmove', function (event) {
           event.preventDefault();
        }, false);
     }
     else {
       canvas.addEventListener('mousemove', function(e) {
           mouse.x = e.pageX - this.offsetLeft;
           mouse.y = e.pageY - this.offsetTop;
       }, false);

       canvas.addEventListener('mousedown', function(e) {
           ctx.beginPath();
           ctx.moveTo(mouse.x, mouse.y);

           canvas.addEventListener('mousemove', onPaint, false);
       }, false);

       canvas.addEventListener('mouseup', function() {
           canvas.removeEventListener('mousemove', onPaint, false);
       }, false);
     }
});
