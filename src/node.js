exports.Node = function(nodeId, x, y) {
  this.nodeId = nodeId;
  this.x = x;
  this.y = y;
  this.frequency = 10;
  if (this.isSink()) {
    this.frequency = 25;
  }
};

exports.Node.prototype = {
  isSink: function() {
    return this.nodeId === '1';
  },
  onAck: function(timestamp, sender_id, frequency) {
    if (this.nodeId === 1) {
      return;
    }
    console.log('Node ' + this.nodeId + ': ' + this.frequency + ' -> ' + frequency);
    this.frequency = frequency;
  },
  onCollision: function(timestamp) {
    console.log('Node ' + this.nodeId + ': collision');
  }
};
