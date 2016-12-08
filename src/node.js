exports.Node = function(nodeId, x, y) {
  this.setNodeId(nodeId);
  this.x = x;
  this.y = y;
  this.frequency = 10;
  if (this.isSink()) {
    this.frequency = 25;
  }
};

exports.Node.prototype = {
  setNodeId: function(nodeId) {
    var first = nodeId / 26;
    var second = nodeId % 26;
    this.nodeId = (String.fromCharCode(97 + first) + String.fromCharCode(97 + second)).toUpperCase();
  },
  isSink: function() {
    return this.nodeId === '1';
  },
  onAck: function(timestamp, sender_id, frequency) {
    if (this.nodeId === 1) {
      return;
    }
    this.frequency = frequency;
  },
  onCollision: function(timestamp) {
    console.log('Node ' + this.nodeId + ': collision');
  }
};
