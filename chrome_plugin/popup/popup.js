document.addEventListener('DOMContentLoaded', function() {

    // Stuff to list requests
    var openInTabButton = document.getElementById('openInTab');
    openInTabButton.addEventListener('click', function() {
        var newURL = "manageMockPanel/manageMockPanel.html";
        chrome.windows.create({ url: newURL });
    });

}, false);
