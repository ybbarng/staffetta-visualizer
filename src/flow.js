exports.Flow = function(fromNode, toNode) {
  this.initiate(fromNode, toNode);
};

exports.Flow.counter = 0;

exports.Flow.prototype = {
  initiate: function(fromNode, toNode) {
    this.id = exports.Flow.counter;
    exports.Flow.counter++;
    this.fromNodeId = fromNode.nodeId;
    this.toNodeId = toNode.nodeId;

    var fromRadius = 4;
    var toRadius = 5;
    this.x1 = fromNode.x * 1;
    this.y1 = fromNode.y * 1;
    this.x2 = toNode.x * 1;
    this.y2 = toNode.y * 1;
    var dy = this.y2 - this.y1;
    var dx = this.x2 - this.x1;
    if (dx * dx + dy * dy < Math.pow(fromRadius + toRadius, 2)) {
      return;
    }
    var theta = Math.atan2(dy, dx);
    this.x1 = this.x1 + fromRadius * Math.cos(theta);
    this.y1 = this.y1 + fromRadius * Math.sin(theta);
    this.x2 = this.x2 - toRadius * Math.cos(theta);
    this.y2 = this.y2 - toRadius * Math.sin(theta);
  },
  toString: function() {
    return 'Flow: ' + this.fromNodeId + ' -> ' + this.toNodeId;
  }
};
