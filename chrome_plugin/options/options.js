document.addEventListener('DOMContentLoaded', function() {

    // Get field which contains the endpoint
    var targetEndpointField = document.getElementById('targetEndpointField');

    // If the local storage value does not exist (user never changed anything ot it is empty), then use default value
    if(!localStorage.mockProxyServerTargetEndpoint){
        localStorage.mockProxyServerTargetEndpoint = "http://localhost:8001";
    }

    // Load value from local storage into input field
    targetEndpointField.value = localStorage.mockProxyServerTargetEndpoint;

    // Button action to save a new valeue from the input field into the local storage
    var saveSettingsButton = document.getElementById('saveSettingsButton');
    saveSettingsButton.addEventListener('click', function () {
        localStorage.mockProxyServerTargetEndpoint = targetEndpointField.value;
    }, false);

});