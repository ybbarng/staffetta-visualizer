exports.Node = function(nodeId, x, y) {
  this.setNodeId(nodeId);
  this.x = x;
  this.y = y;
  this.frequency = 10;
  if (this.isSink) {
    this.frequency = 25;
  }
  this.inMessage = 0;
  this.outMessage = 0;
};

exports.Node.prototype = {
  setNodeId: function(nodeId) {
    nodeId -= 2;
    var first = Math.floor(nodeId / 26);
    var second = nodeId % 26;
    var firstChar = first === 0 ? '' : String.fromCharCode(64 + first);
    var secondChar = String.fromCharCode(65 + second);
    this.nodeId = firstChar + secondChar;
    this.isSink = nodeId === -1;
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
