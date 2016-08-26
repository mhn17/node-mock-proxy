// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area for creating mocks from requests
chrome.devtools.panels.create("Create Mocks", "images/icon.png", "createMockPanel/panel.html", function(panel) {});
// Create a tab in the devtools area for activation and deactivating mocks
chrome.devtools.panels.create("Manage Mocks", "images/icon.png", "manageMockPanel/manageMockPanel.html", function(panel) {});

