// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
  
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

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("EnableMock")){
        var mockName = port.name.split("?")[1];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/moveAvailableMockToEnabled?name=" + mockName, false);
        xhr.send();
     }
});

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("DisableMock")){
        var mockName = port.name.split("?")[1];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/moveEnabledMockToAvailable?name=" + mockName, false);
        xhr.send();
     }
});

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("DeleteMock")){
        var mockName = port.name.split("?")[1];
        var state = port.name.split("?")[2];
        var deleteBody = JSON.stringify({id: mockName, enabled: state});
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        var getParameters = "?name=" + mockName + "&enabled=" + state;
        
        xhr.open("DELETE", "http://www.localhost:8001/api/mocks/delete", false);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(deleteBody);
        var result = xhr.responseText;
        port.postMessage({result: result}); 
     }
});

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("GetResponseFromMock")){
        var mockName = port.name.split("?")[1];
        var state = port.name.split("?")[2];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        var getParameters = "?name=" + mockName + "&enabled=" + state;
        xhr.open("GET", "http://www.localhost:8001/api/getMockResponse" + getParameters, false);
        xhr.send();
        var result = xhr.responseText;
        port.postMessage({result: result}); 
     }
});

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

chrome.runtime.onConnect.addListener(function(port){
     if(port.name === "SaveLastRequestToMocks"){
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "http://www.localhost:8001/api/requests/save-last-request", false);
        xhr.send();
        var result = xhr.responseText;
        //var jsonResult = JSON.parse(result)
        port.postMessage({result: result});   
     }
});

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("AddRequestToMocks")){
        var mockName = port.name.split("?")[1];
        var postBody = JSON.stringify({id: mockName});
         
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