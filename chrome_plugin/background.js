// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
  
/* ----- Mocks ----- */

// Mocks
chrome.runtime.onConnect.addListener(function(port){
     if(port.name === "GetMocks"){
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/mocks", false);
        xhr.send();
        var result = xhr.responseText;
        var jsonResult = JSON.parse(result)
        port.postMessage({result: jsonResult});   
     }
});

// Enable
chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("EnableMock")){
        var mockId = port.name.split("?")[1];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "http://www.localhost:8001/api/mocks/" + mockId + "/enable", false);
        xhr.send();
     }
});

// Disable
chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("DisableMock")){
        var mockId = port.name.split("?")[1];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "http://www.localhost:8001/api/mocks/" + mockId + "/disable", false);
        xhr.send();
     }
});

// Delete
chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("DeleteMock")){
        var mockId = port.name.split("?")[1];

        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();        
        xhr.open("DELETE", "http://www.localhost:8001/api/mocks/" + mockId + "/delete", false);
        xhr.send();
        var result = xhr.responseText;
        port.postMessage({result: result}); 
     }
});

/* ----- Requests ----- */

// Requests
chrome.runtime.onConnect.addListener(function(port){
     if(port.name === "GetPossibleMockList"){
        // Send request and list
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/requests", false);
        xhr.send();
        var result = xhr.responseText;
        var jsonResult = JSON.parse(result)
        port.postMessage({result: jsonResult});   
     }
});

// Delete
chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name === "ClearRequestLog"){
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://www.localhost:8001/api/requests/delete", false);
        xhr.send();
     }
});

// Create
chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("AddRequestToMocks")){
        var requestId = port.name.split("?")[1];
        var postBody = JSON.stringify({id: requestId});
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://www.localhost:8001/api/mocks/create", false);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(postBody);
        var result = xhr.responseText;
        port.postMessage({result: result}); 
     }
});

// Save last request
chrome.runtime.onConnect.addListener(function(port){
     if(port.name === "SaveLastRequestToMocks"){
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://www.localhost:8001/api/mocks/createFromLastRequest", false);
        xhr.send();
        var result = xhr.responseText;
        //var jsonResult = JSON.parse(result)
        port.postMessage({result: result});   
     }
});

// Obsolete ?

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("GetResponseFromMock")){
        var mockName = port.name.split("?")[1];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/mocks/" + mockName, false);
        xhr.send();
        var result = xhr.responseText;
        port.postMessage({result: result}); 
     }
});

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("GetResponseForRequestInLog")){
        var mockName = port.name.split("?")[1];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/requests/" + mockName, false);
        xhr.send();
        var result = xhr.responseText;
        port.postMessage({result: result}); 
     }
});
