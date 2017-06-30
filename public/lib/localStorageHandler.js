/**
 * Constructor.
 * **/
var LocalStorageHandler = function () {

};

/**
 * Returns all endpoints.
 *
 * @return Returns all endpoints as an array of objects.
 * **/
LocalStorageHandler.prototype.getEndpoints = function () {
    if (!this._isEndpointEntryExisting()){
        return [];
    }

    var sourceEndpoints = JSON.parse(localStorage.mockProxyServerTargetEndpoint);
    var endpoints = [];

    sourceEndpoints.forEach(function (parsedEndpoint) {
        var endpoint = new Endpoint(parsedEndpoint.address, parsedEndpoint.active);

        endpoints.push(endpoint);
    });

    return endpoints;
};

/***
 * Returns the currently active endpoint address.
 *
 * @return Returns the currently active address as a string.
 * */
LocalStorageHandler.prototype.getActiveEndpointAddress = function () {
    // Load data from local storage
    var endpointArray = this.getEndpoints();
    var resultEndpointAddress;

    // Find correct endpoint
    endpointArray.forEach(function(endpoint) {

        if(endpoint.isActive()){
            resultEndpointAddress = endpoint.getAddress();
        }
    });

    return resultEndpointAddress;
};

/**
 * Sets the endpoints in the local storage.
 * **/
LocalStorageHandler.prototype.setEndpoints = function(endpointArray){
    localStorage.mockProxyServerTargetEndpoint = JSON.stringify(endpointArray);
};

/**
 * Sets the endpoint to a default value if no endpoint is set.
 * **/
LocalStorageHandler.prototype.setDefaultEndpointIfNoEndpointIsSet = function () {
    if (!this._isEndpointEntryExisting()) {
        var defaultEndpoint = [];
        defaultEndpoint[0] = new Endpoint("http://localhost:8001", true);
        this.setEndpoints(defaultEndpoint);
        alert("No target endpoint configuration found. Requests target is: " + this.getActiveEndpointAddress());
    }
}

/**
 * Checks the endpoint entry already exists in the local storage.
 *
 * @return Returns true of the local storage entry exists, else false.
 * **/
LocalStorageHandler.prototype._isEndpointEntryExisting = function () {
    if (!localStorage.mockProxyServerTargetEndpoint
        || JSON.parse(localStorage.mockProxyServerTargetEndpoint).length === 0){
        return false;
    }
    return true;
};

LocalStorageHandler.prototype._transformToEndpointObject = function (endpointsSource) {
    var endpointsTarget = [];
}