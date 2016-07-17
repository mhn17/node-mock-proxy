document.addEventListener('DOMContentLoaded', function() {
  
    // Stuff to list requests
    var listRequestButton = document.getElementById('listRequests');
    listRequestButton.addEventListener('click', function() {
  
    // Get the list as an array of json objects via message passing to the backgound
    // XHS is not directly possible in developer toolbar
    var mockListRequest = chrome.runtime.connect({name: "GetPossibleMockList"});
    mockListRequest.onMessage.addListener(function(message,sender){
        // Get results
        var requestList = message.result;
        document.getElementById("requestList").innerHTML = "";
        
        // Create new element and add results!
        // Gets a lot shorter when I find out how to use jQuery in here properly
        requestList.forEach(function(entry) {

            // Content
            var container = document.getElementById("requestList");
            var contentDiv = document.createElement("div");

            // Input
            var addButton = document.createElement("button");
            addButton.innerHTML = "Add";

            // Register event listener to checkboxes
            addButton.addEventListener("click", function(){
                // XHS is not directly possible in developer toolbar
                var port = chrome.runtime.connect({name: "AddRequestToMocks?" + entry.fileName});
                port.onMessage.addListener(function(message,sender){
                    alert(message.result);
                });
            });
            contentDiv.appendChild(addButton);

            // Text
            var textNode = document.createElement("label");        
            var node = document.createTextNode(entry.fileName);
            textNode.appendChild(node);
            contentDiv.appendChild(textNode);

            container.appendChild(contentDiv);    
        }); 
    });
  
   

  }, false);
  
    // Save last request as mock
    var saveLastRequestButton = document.getElementById('saveLastRequest');
    saveLastRequestButton.addEventListener('click', function() {

        var saveLastRequestRequest = chrome.runtime.connect({name: "SaveLastRequestToMocks"});
        saveLastRequestRequest.onMessage.addListener(function(message,sender){
        // Get result
        var result = message.result;
        alert(result);
       
        });
        
    }, false);
 
 
     // Save last request as mock
    var clearRequestButton = document.getElementById('clearRequests');
    clearRequestButton.addEventListener('click', function() {

        var clearRequestsRequest = chrome.runtime.connect({name: "ClearRequestLog"});
        clearRequestsRequest.onMessage.addListener(function(message,sender){
            // Do something here?
        });
        
    }, false);
}, false);

/*
    for each (var item in jsonResult) {
        var para = document.createElement("p");
        var node = document.createTextNode(item);
        para.appendChild(node);
        var element = document.getElementById("MockTest");
        element.appendChild(para);
     }*/