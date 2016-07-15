document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
  
    // Send request and list
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.localhost:8001/api/available-requests", false);
    xhr.send();
    var result = xhr.responseText;
    var jsonResult = JSON.parse(result);
    
    // Create new element and add results!
    // Gets a lot shorter when I find out how to use jQuery in here properly
    jsonResult.forEach(function(entry) {
        
        // Content
        var container = document.getElementById("MockTest");
        var contentDiv = document.createElement("div");
        
        // Input
        var inputNode = document.createElement("input");
        inputNode.setAttribute("type", "checkbox");
        inputNode.addEventListener("click", function(){
            // This here must be changed so that the correct endpoint will be called
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://www.localhost:8001/api/available-requests", false);
            xhr.send();
            var result = xhr.responseText;
            //var jsonResult = JSON.parse(result);        
        });
        contentDiv.appendChild(inputNode);
        
        // Text
        var textNode = document.createElement("p");        
        var node = document.createTextNode(entry);
        textNode.appendChild(node);
        contentDiv.appendChild(textNode);
        
        container.appendChild(contentDiv);    
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