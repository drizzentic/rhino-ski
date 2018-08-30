var Utils=(function () {
    var store=localStorage;
    var obstacleTypes = [
        'tree',
        'treeCluster',
        'rock1',
        'rock2',
        'ramp',
    ];
    var storeParams=function (key,value) {
        store.setItem(key,value);
    };

    var getParams= function (param) {
        return JSON.parse(store.getItem(param));
    };

    var assetsPath='../assets/img';
    var loadedAssets={};

    //Assets
    var assets = {
        'skierCrash' : assetsPath+'/skier_crash.png',
        'skierLeft' : assetsPath+'/skier_left.png',
        'skierLeftDown' : assetsPath+'/skier_left_down.png',
        'skierDown' : assetsPath+'/skier_down.png',
        'skierRightDown' : assetsPath+'/skier_right_down.png',
        'skierRight' : assetsPath+'/skier_right.png',
        'tree' : assetsPath+'/tree_1.png',
        'treeCluster' : assetsPath+'/tree_cluster.png',
        'rock1' : assetsPath+'/rock_1.png',
        'rock2' : assetsPath+'/rock_2.png',
        'ramp': assetsPath+'/jump_ramp.png',
        'jump':assetsPath+'/skier_jump_3.png'
    };

    //Declare private methods

    var loadAssets = function () {
        var assetPromises = [];

        _.each(assets, function(asset, assetName) {
            var assetImage = new Image();
            var assetDeferred = new $.Deferred();

            assetImage.onload = function() {
                assetImage.width /= 2;
                assetImage.height /= 2;

                loadedAssets[assetName] = assetImage;
                assetDeferred.resolve();
            };
            assetImage.src = asset;

            assetPromises.push(assetDeferred.promise());

        });

        return $.when.apply($, assetPromises);
    };


    return{
        obstacleTypes,
        loadAssets:loadAssets(),
        getParams:getParams,
        storeParams:storeParams,
        loadedAssets
    }
}());
