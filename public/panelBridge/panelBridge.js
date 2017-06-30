// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area for managing mocks and requests
chrome.devtools.panels.create("Manage Mocks", "images/icon.png", "manageMockPanel/manageMockPanel.html#panel", function(panel) {});

