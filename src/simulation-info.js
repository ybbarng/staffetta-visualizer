exports.SimulationInfo = function() {
  this.initiate();
};

exports.SimulationInfo.prototype = {
  initiate: function() {
    this.collision = 0;
    this.timestamp = 0;
    this.lastTimestamp = 0;
    this.totalPower = 0;
  },
  updateTotalPower: function(nodes) {
    this.totalPower = 0;
    for (var i = 0; i < nodes.length; i++) {
      this.totalPower += nodes[i].power;
    }
  }
};
