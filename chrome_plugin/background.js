// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
  
chrome.runtime.onConnect.addListener(function(port){
     if(port.name === "GetPossibleMockList"){
        // Send request and list
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/available-requests", false);
        xhr.send();
        var result = xhr.responseText;
        var jsonResult = JSON.parse(result)
        port.postMessage({result: jsonResult});   
     }
});

chrome.runtime.onConnect.addListener(function(port){
     if(port.name === "SaveLastRequestToMocks"){
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/save-last-request", false);
        xhr.send();
        var result = xhr.responseText;
        //var jsonResult = JSON.parse(result)
        port.postMessage({result: result});   
     }
});

chrome.runtime.onConnect.addListener(function(port){
     if(port.name === "GetMocks"){
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/mockList", false);
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
    if(port.name.includes("AddRequestToMocks")){
        var mockName = port.name.split("?")[1];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/addMockToMocks?name=" + mockName, false);
        xhr.send();
        var result = xhr.responseText;
        port.postMessage({result: result}); 
     }
});

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name.includes("DeleteMock")){
        var mockName = port.name.split("?")[1];
        var state = port.name.split("?")[2];
         
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        var getParameters = "?name=" + mockName + "&enabled=" + state;
        
        xhr.open("GET", "http://www.localhost:8001/api/deleteMock" + getParameters, false);
        xhr.send();
        var result = xhr.responseText;
        port.postMessage({result: result}); 
     }
});

chrome.runtime.onConnect.addListener(function(port){
    // There has to be a better way to transfer the mock name ... 
    if(port.name === "ClearRequestLog"){
        // Send request and list
        // This here must be changed so that the correct endpoint will be called
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://www.localhost:8001/api/clearRequestLog", false);
        xhr.send();
     }
});