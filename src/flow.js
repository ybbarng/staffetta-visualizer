exports.Flow = function(fromNode, toNode) {
  this.fromNode = fromNode;
  this.toNode = toNode;
  this.initiate();
};

exports.Flow.prototype = {
  initiate: function() {
    var fromRadius = 4;
    var toRadius = 5;
    var x1 = this.fromNode.x * 1;
    var y1 = this.fromNode.y * 1;
    var x2 = this.toNode.x * 1;
    var y2 = this.toNode.y * 1;
    var theta = Math.atan2(y2 - y1, x2 - x1);
    this.x1 = x1 + fromRadius * Math.cos(theta);
    this.y1 = y1 + fromRadius * Math.sin(theta);
    this.x2 = x2 - toRadius * Math.cos(theta);
    this.y2 = y2 - toRadius * Math.sin(theta);
  },
  toString: function() {
    return 'Flow: ' + this.fromNode.nodeId + ' -> ' + this.toNode.nodeId;
  }
};
