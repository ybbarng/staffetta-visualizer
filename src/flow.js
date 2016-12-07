exports.Flow = function(fromNode, toNode) {
  this.fromNode = fromNode;
  this.toNode = toNode;
};

exports.Flow.prototype = {
  getX1: function() {
    return this.fromNode.x;
  },
  getY1: function() {
    return this.fromNode.y;
  },
  getX2: function() {
    return this.toNode.x;
  },
  getY2: function() {
    return this.toNode.y;
  }
};
