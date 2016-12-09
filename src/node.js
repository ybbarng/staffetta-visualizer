exports.Node = function(nodeId, x, y) {
  this.setNodeId(nodeId);
  this.x = x;
  this.y = y;
  this.frequency = 10;
  if (this.isSink) {
    this.frequency = 25;
  }
};

exports.Node.prototype = {
  setNodeId: function(nodeId) {
    nodeId -= 1;
    var first = nodeId / 26;
    var second = nodeId % 26;
    this.nodeId = (String.fromCharCode(97 + first) + String.fromCharCode(97 + second)).toUpperCase();
    this.isSink = nodeId === 0;
    if (this.isSink) {
      this.nodeId = 'sink';
    }
  },
  onAck: function(timestamp, sender_id, frequency) {
    if (this.isSink) {
      return;
    }
    this.frequency = frequency;
  },
  onCollision: function(timestamp) {
    console.log('Node ' + this.nodeId + ': collision');
  }
};
