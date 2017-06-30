var Endpoint = function (address, active) {
    this.address = address;
    this.active = active;
};

Endpoint.prototype.setAddress = function (address) {
    this.address = address;
};

Endpoint.prototype.setActive = function (active) {
    this.active = active;
};

Endpoint.prototype.getAddress = function () {
  return this.address;
};

Endpoint.prototype.isActive = function () {
    return this.active;
};