exports.Node = function(nodeId, x, y) {
  this.nodeId = nodeId;
  this.x = x;
  this.y = y;
  this.frequency = 10;
};

exports.Node.prototype = {
  onMessage: function(timestamp, message) {
    if (/^\d+ \d+ \d+$/.test(message)) {
      return this.parse(timestamp, message.split(' ').map(Number));
    } else if (message.indexOf('collision') !== -1) {
      this.onCollision(timestamp);
      return false;
    }
    return false;
  },
  parse: function(timestamp, argv) {
    if (this.nodeId !== '1' && argv[0] === 2) {
      this.onAck(timestamp, argv[1], argv[2]);
      return true;
    }
    return false;
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
