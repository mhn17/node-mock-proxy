document.addEventListener('DOMContentLoaded', function() {
  
    // Stuff to list requests
    var listRequestButton = document.getElementById('refreshMocksButton');
    listRequestButton.addEventListener('click', function() {
  
    // Get the list as an array of json objects via message passing to the backgound
    // XHS is not directly possible in developer toolbar
    var mockListRequest = chrome.runtime.connect({name: "GetMocks"});
    mockListRequest.onMessage.addListener(function(message,sender){
        // Get results and clear previous results
        var mockList = message.result;
        document.getElementById("mockList").innerHTML = "";
        
        // Create new element and add results!
        // Gets a lot shorter when I find out how to use jQuery in here properly
        mockList.forEach(function(entry) {

            // Content
            var container = document.getElementById("mockList");
            var contentDiv = document.createElement("div");

            // Input
            var inputNode = document.createElement("input");
            inputNode.setAttribute("type", "checkbox");
            inputNode.checked = entry.enabled;
            
            // Register event listener to checkboxes
            inputNode.addEventListener("click", function(){
                // If mock is being enabled get the mock name from the label and
                // build get request 
                if(this.checked){
                   var mockName = this.nextSibling.innerHTML;
                    // XHS is not directly possible in developer toolbar
                    var port = chrome.runtime.connect({name: "EnableMock?" + mockName});

                // If mock is being disabled get the mock name from the label and
                // build get request 
                }else{
                    var mockName = this.nextSibling.innerHTML;
                    // XHS is not directly possible in developer toolbar
                    var port = chrome.runtime.connect({name: "DisableMock?" + mockName});
                }
            });
            contentDiv.appendChild(inputNode);

            // Text
            var textNode = document.createElement("label");        
            var node = document.createTextNode(entry.name);
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
 
}, false);

/*
    for each (var item in jsonResult) {
        var para = document.createElement("p");
        var node = document.createTextNode(item);
        para.appendChild(node);
        var element = document.getElementById("MockTest");
        element.appendChild(para);
     }*/