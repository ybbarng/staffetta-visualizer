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
    var x1 = fromNode.x * 1;
    var y1 = fromNode.y * 1;
    var x2 = toNode.x * 1;
    var y2 = toNode.y * 1;
    var theta = Math.atan2(y2 - y1, x2 - x1);
    this.x1 = x1 + fromRadius * Math.cos(theta);
    this.y1 = y1 + fromRadius * Math.sin(theta);
    this.x2 = x2 - toRadius * Math.cos(theta);
    this.y2 = y2 - toRadius * Math.sin(theta);
  },
  toString: function() {
    return 'Flow: ' + this.fromNodeId + ' -> ' + this.toNodeId;
  }
};
