exports.Collision = function(node) {
  this.initiate(node);
};

exports.Collision.counter = 0;

exports.Collision.prototype = {
  initiate: function(node) {
    this.id = exports.Collision.counter;
    exports.Collision.counter++;
    this.nodeId = node.nodeId;
    this.x = node.x - 6;
    this.y = node.y - 6;
  }
};
