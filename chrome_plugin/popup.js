document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {
  
    // Seend request and list
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.localhost:8001/api/available-requests", false);
    xhr.send();
    var result = xhr.responseText;
    
    // Create new element and add results!
    var para = document.createElement("p");
    var node = document.createTextNode(result);
    para.appendChild(node);

    var element = document.getElementById("MockTest");
    element.appendChild(para);

  }, false);
}, false);