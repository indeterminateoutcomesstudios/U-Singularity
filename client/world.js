function World() {
  this.width = 100;
  this.height = 100;
  this.grid = new Grid(this.width, this.height);
  this.gridOverwrite = new Grid(this.width, this.height);
  
  this.resize = function (width, height) {
    this.width = width;
    this.height = height;
    this.grid.resize(width, height);
    this.gridOverwrite.resize(width, height);
  }

  this.tileGet = function (tileX, tileY) {
    var tile = res.tiles[this.grid.cellGet(tileX, tileY)];
    var overwrite = this.gridOverwrite.cellGet(tileX, tileY);
    return Object.assign({}, tile, overwrite);
  }

  this.cellSetOverwrite = function (tileX, tileY, data) {
    this.gridOverwrite.cellSet(tileX, tileY, data);
  }

  this.draw = function () {
    this.updateView(view);
  }
}

World.prototype.updateView = function(view){
  for (var i=0; i<(Math.ceil(view.width/32)+1)*(Math.ceil(view.height/32)+1); i++){
    var cx = Math.floor(view.x / 32)+(i % (Math.ceil(view.width/32)+1)) //cellXvie
    var cy = Math.floor(view.y / 32)+Math.floor(i / (Math.ceil(view.width/32)+1)) //cellY
    view.sprites[i].x = cx*32;
    view.sprites[i].y = cy*32;
    if (cx >= 0 && cy >= 0 && cx < this.width-1 && cy < this.height-1){
      var tileIndex = this.grid.cellGet(cx, cy);
      var tile = res.tiles[tileIndex];
      if (tile != undefined){
        var imageIndex = 0;
        switch (tile.connectionType){
          case "simple":
            var tile_top = (this.tileGet(cx, cy - 1).connectionGroup != tile.connectionGroup);
            var tile_left = (this.tileGet(cx - 1, cy).connectionGroup != tile.connectionGroup);
            var tile_right = (this.tileGet(cx + 1,cy).connectionGroup != tile.connectionGroup);
            var tile_bottom = (this.tileGet(cx, cy + 1).connectionGroup != tile.connectionGroup);
            if (tile_top != undefined && tile_bottom != undefined && tile_right != undefined && tile_left != undefined) {
              if (tile_top) { //top lane
                if (tile_left) {
                  imageIndex = 0;
                } else if (tile_right) {
                  imageIndex = 2;
                } else {
                  imageIndex = 1;
                }
              } else if (tile_bottom) { //bottom lane
                if (tile_left) {
                  imageIndex = 6;
                } else if (tile_right) {
                  imageIndex = 8;
                } else {
                  imageIndex = 7;
                }
              } else { //middle lane
                if (tile_left) {
                  imageIndex = 3;
                } else if (tile_right) {
                  imageIndex = 5;
                } else {
                  imageIndex = 4;
                }
              }
            }
          break;
        }
        view.sprites[i].setTexture(getTextureFrame(subfolder+"sprites/"+tile.sprite,imageIndex,32,32));
      }
    }
  }
}

function View(width,height){
  this.width = width;
  this.height = height;
  this.x = 0;
  this.y = 0;
  this.zoom = 1;
  this.sprites = [];
  for (var i=0; i<(Math.ceil(width/32)+1)*(Math.ceil(height/32)+1); i++){
    this.sprites[i] = new PIXI.Sprite();
    stageTiles.addChild(this.sprites[i]);
  }
}

View.prototype.setZoom = function(zoom){
  if (zoom != 0){
    this.zoom = zoom;
    this.width = window.innerWidth / zoom;
    this.height = window.innerHeight / zoom;
    this.sprites.forEach(function(sprite){
      sprite.destroy();
    });
    this.sprites = [];
    for (var i=0; i<(Math.ceil(this.width/32)+1)*(Math.ceil(this.height/32)+1); i++){
      this.sprites[i] = new PIXI.Sprite();
      stageTiles.addChild(this.sprites[i]);
    }
  }else{
    console.error("View can't zoom to 0")
  }
}