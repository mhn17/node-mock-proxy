// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
chrome.devtools.panels.create("Create Mocks", "images/icon.png", "createMockPanel/panel.html", function(panel) {});