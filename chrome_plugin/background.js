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