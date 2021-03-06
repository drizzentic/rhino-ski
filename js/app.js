$(document).ready(function() {
    var canvas=Canvas;
    var recentScore=0;
    var gameState=false;
    var ctx=canvas.createCanvas();
    var obstacleTypes;
    var gameWidth = window.innerWidth;

    var gameHeight = window.innerHeight;
    var skierSpeed=0;
    var skierMapY=0;
    var skierMapX=0;
    var skierDirection=0;

    var loadedAssets = {};


    var obstacles = [];

    //modify canvas looks
    ctx.shadowBlur=1;
    ctx.shadowColor="grey";

    var moveSkier = function() {
        switch(skierDirection) {
            case 2:
                skierMapX -= Math.round(skierSpeed / 1.4142);
                skierMapY += Math.round(skierSpeed / 1.4142);
                Utils.storeParams("skierMapX",skierMapX);
                Utils.storeParams("skierMapY",skierMapY);
                Utils.storeParams("skierDirection",skierDirection);
                placeNewObstacle(skierDirection);
                break;
            case 3:
                skierMapY += skierSpeed;
                Utils.storeParams("skierMapY",skierMapY);
                Utils.storeParams("skierDirection",skierDirection);
                placeNewObstacle(skierDirection);
                break;
            case 4:
                skierMapX += skierSpeed / 1.4142;
                skierMapY += skierSpeed / 1.4142;
                Utils.storeParams("skierMapX",skierMapX);
                Utils.storeParams("skierMapY",skierMapY);
                Utils.storeParams("skierDirection",skierDirection);
                placeNewObstacle(skierDirection);
                break;
            case 6:
                //skierMapX -= skierSpeed / 1.4142;
                skierMapY += skierSpeed;
                Utils.storeParams("skierMapY",skierMapY);
                Utils.storeParams("skierDirection",skierDirection);
                placeNewObstacle(skierDirection)
                break;

        }
    };

    var getSkierAsset = function() {
        var skierAssetName;
        switch(skierDirection) {
            case 0:
                skierAssetName = 'skierCrash';
                break;
            case 1:
                skierAssetName = 'skierLeft';
                break;
            case 2:
                skierAssetName = 'skierLeftDown';
                break;
            case 3:
                skierAssetName = 'skierDown';
                break;
            case 4:
                skierAssetName = 'skierRightDown';
                break;
            case 5:
                skierAssetName = 'skierRight';
                break;
            case 6:
                skierAssetName='jump';
        }

        return skierAssetName;
    };

    var drawSkier = function() {
        var skierAssetName = getSkierAsset();
        var skierImage = loadedAssets[skierAssetName];
        var x = (gameWidth - skierImage.width) / 2;
        var y = (gameHeight - skierImage.height) / 2;

        ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
    };

    var drawObstacles = function() {
        var newObstacles = [];

        _.each(obstacles, function(obstacle) {
            var obstacleImage = loadedAssets[obstacle.type];
            var x = obstacle.x - skierMapX - obstacleImage.width / 2;
            var y = obstacle.y - skierMapY - obstacleImage.height / 2;

            if(x < -100 || x > gameWidth + 50 || y < -100 || y > gameHeight + 50) {
                return;
            }

            ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

            newObstacles.push(obstacle);
        });

        obstacles = newObstacles;
    };

    var placeInitialObstacles = function() {
        var numberObstacles = Math.ceil(_.random(5, 7) * (gameWidth / 800) * (gameHeight / 500));

        var minX = -50;
        var maxX = gameWidth + 50;
        var minY = gameHeight / 2 + 100;
        var maxY = gameHeight + 50;

        for(var i = 0; i < numberObstacles; i++) {
            placeRandomObstacle(minX, maxX, minY, maxY);
        }

        obstacles = _.sortBy(obstacles, function(obstacle) {
            var obstacleImage = loadedAssets[obstacle.type];
            return obstacle.y + obstacleImage.height;
        });
    };

    var placeNewObstacle = function(direction) {
        var shouldPlaceObstacle = _.random(1, 8);
        if(shouldPlaceObstacle !== 8) {
            return;
        }

        var leftEdge = skierMapX;
        var rightEdge = skierMapX + gameWidth;
        var topEdge = skierMapY;
        var bottomEdge = skierMapY + gameHeight;

        switch(direction) {
            case 1: // left
                placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                placeRandomObstacle(leftEdge, rightEdge, bottomEdge, topEdge);
                break;
        }
    };

    var placeRandomObstacle = function(minX, maxX, minY, maxY) {
        var obstacleIndex = _.random(0, obstacleTypes.length - 1);

        var position = calculateOpenPosition(minX, maxX, minY, maxY);

        obstacles.push({
            type : obstacleTypes[obstacleIndex],
            x : position.x,
            y : position.y
        })
    };

    var calculateOpenPosition = function(minX, maxX, minY, maxY) {
        var x = _.random(minX, maxX);
        var y = _.random(minY, maxY);

        var foundCollision = _.find(obstacles, function(obstacle) {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if(foundCollision) {
            return calculateOpenPosition(minX, maxX, minY, maxY);
        }
        else {
            return {
                x: x,
                y: y
            }
        }
    };

    var checkIfSkierHitObstacle = function() {
        var skierAssetName = getSkierAsset();
        var skierImage = loadedAssets[skierAssetName];
        var skierRect = {
            left: skierMapX + gameWidth / 2,
            right: skierMapX + skierImage.width + gameWidth / 2,
            top: skierMapY + skierImage.height - 5 + gameHeight / 2,
            bottom: skierMapY + skierImage.height + gameHeight / 2
        };
        //TODO: Add avoid collitions logic
        var collision = _.find(obstacles, function(obstacle) {
            var obstacleImage = loadedAssets[obstacle.type];
            var obstacleRect = {
                left: obstacle.x,
                right: obstacle.x + obstacleImage.width,
                top: obstacle.y + obstacleImage.height - 5,
                bottom: obstacle.y + obstacleImage.height
            };

            return intersectRect(skierRect, obstacleRect);
        });

        if(collision) {
            skierDirection = 0;
            Utils.storeParams("skierDirection",0);
            Utils.storeParams("highscore",recentScore);
            Utils.storeParams("current",0);
            gameState=false;
            Canvas.updateScore();
        }else{
            Utils.storeParams("current",recentScore);
            if(gameState){
                recentScore++;
            }
            Canvas.updateScore();
        }

    };

    var intersectRect = function(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };

    var gameLoop = function() {

        ctx.save();

        // Retina support
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        canvas.clearCanvas(ctx);

        moveSkier();

        checkIfSkierHitObstacle();

        drawSkier();

        drawObstacles();

        ctx.restore();

        requestAnimationFrame(gameLoop);
    };

    var setupKeyhandler = function() {
        $(window).keydown(function(event) {
            //Change game state
            //Increase speed for button pressed
            Utils.storeParams("skierSpeed",skierSpeed+=0.1);
            switch(event.which) {
                case 32: //space
                    skierDirection = 0;
                    gameState=false;
                    event.preventDefault();
                    break;
                case 37: // left
                    if(skierDirection === 1) {
                        skierMapX -= skierSpeed;
                        placeNewObstacle(skierDirection);
                    }else if(skierDirection === 0){
                        skierMapX -= skierSpeed;
                        placeNewObstacle(skierDirection);
                    }
                    else {
                        skierDirection--;
                    }

                    gameState=true;
                    event.preventDefault();
                    break;
                case 39: // right
                    if(skierDirection === 5) {
                        skierMapX += skierSpeed;
                        placeNewObstacle(skierDirection);
                    }
                    else {
                        skierDirection++;
                    }

                    gameState=true;
                    event.preventDefault();
                    break;
                case 38: // up
                    if(skierDirection === 1 || skierDirection === 5) {

                        placeNewObstacle(6);
                    }
                    gameState=true;
                    skierDirection=6;

                    event.preventDefault();
                    break;
                case 40: // down
                    skierDirection = 3;
                    gameState=true;

                    event.preventDefault();
                    break;
            }
        });

    };

    var initGame = function() {
        setupKeyhandler();
        obstacleTypes=Utils.obstacleTypes;
        Utils.storeParams("skierMapX",0);
        Utils.storeParams("skierMapY",0);
        Utils.storeParams("skierDirection",5);
        Utils.storeParams("skierSpeed",8);

        //Initialize default direction
        Utils.loadAssets.then(function() {
             skierSpeed=Utils.getParams('skierSpeed');
             skierMapY=Utils.getParams('skierMapY');
             skierMapX=Utils.getParams('skierMapX');
             skierDirection=Utils.getParams('skierDirection');
            loadedAssets=Utils.loadedAssets;
            placeInitialObstacles();
            requestAnimationFrame(gameLoop);
        });
    };

    initGame();
});