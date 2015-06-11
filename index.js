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

    $('#wipe').click(function(){
        whiteboard.child('context').set({}, onComplete);
    });

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
        if(!snapshot.val()) return ctx.clearRect(0, 0, canvas.width, canvas.height);
        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        var data = snapshot.val();
        img.src = data.context;
    });

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
});
