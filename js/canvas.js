var Canvas=(function (){
    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight;
    var createCanvas=function() {

        var canvas = $('<canvas></canvas>')
            .attr('width', gameWidth * window.devicePixelRatio)
            .attr('height', gameHeight * window.devicePixelRatio)
            .css({
                width: gameWidth + 'px',
                height: gameHeight + 'px'
            });
        $('body').append(canvas);

         return canvas[0].getContext('2d');
    };

    var updateScore=function () {
        $('#current').remove();
        $('#high').remove();

        var current=$('<p id="current">Your Current Score is '+Utils.getParams('current')+' </p>')
            .css(
                {
                    position: 'absolute',
                    top: 0,
                    width: 50 +'%',
                    left: 0+'px',
                    color:'Red'
                });
        var high=$('<p id="high">Your High Score is '+Utils.getParams('highscore')+' </p>')
            .css(
                {
                    position: 'absolute',
                    top: 0,
                    width: 50 +'%',
                    right: 0+'px',
                    color: 'green'
                });
        $('body').append(current);
        $('body').append(high);
    }


    var clearCanvas = function(ctx) {
        return ctx.clearRect(0, 0, gameWidth, gameHeight);
    };

    return {
        createCanvas:createCanvas,
        clearCanvas:clearCanvas,
        updateScore:updateScore
    }
}());