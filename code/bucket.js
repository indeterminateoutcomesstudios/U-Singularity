//A bucket is used to split the world into multiple parts, like chunks in minecraft

function Bucket(x,y,world){
  this.objects = {};
  this.player = {};
  this.x = x;
  this.y = y;
  this.world = world;
  this.width = config.bucket.width;
  this.height = config.bucket.height;
}
Bucket.prototype.addObject = function(object){
  this.objects[object.id] = object;
}
Bucket.prototype.removeObject = function(object){
  delete this.objects[object.id];
}
Bucket.prototype.addPlayer = function(object){
  this.player[object.id] = object;
}
Bucket.prototype.removePlayer = function(object){
  delete this.player[object.id];
}
Bucket.prototype.broadcast = function(msg,data){
  for(k in this.player){
    this.player[k].socket.emit(msg,data);
  }
}
Bucket.prototype.broadcastArea = function(msg,data,range){
  var rad = range || 3;
  for(var i = 0; i<rad*rad; i++){
    var x = Math.max(Math.min((i % rad + this.x) - Math.floor(rad/2),this.world.buckets.width),0);
    var y = Math.max(Math.min((Math.floor(i/rad) + this.y) - Math.floor(rad/2),this.world.buckets.height),0);
    this.world.buckets.cellGet(x,y).broadcast(msg,data)
  }
}
Bucket.prototype.sendMegaPacket = function(socket){
  for(k in this.objects){
    socket.emit('ent_data',this.objects[k].getClientData());
  }
  socket.emit('world_region',{str:wrd.grid.saveRegion(this.x*this.width, this.y*this.height, this.width, this.height),x:this.x*this.width,y:this.y*this.height,w:this.width})
  //socket.emit("bucket",{players:{},objects:{},world:{}});
}
Bucket.prototype.sendMegaPacketArea = function(socket){
  var rad = 3;
  for(var i = 0; i<rad*rad; i++){
    var x = Math.max(Math.min((i % rad + this.x) - Math.floor(rad/2),this.world.buckets.width),0);
    var y = Math.max(Math.min((Math.floor(i/rad) + this.y) - Math.floor(rad/2),this.world.buckets.height),0);
    this.world.buckets.cellGet(x,y).sendMegaPacket(socket)
  }
}
Bucket.prototype.clear = function(){
  this.objects = {};
  this.player = {};
}
Bucket.prototype.getClients = function(){
  return this.player;
}

module.exports.Bucket = Bucket;