# node-mock-proxy
A simple proxy server for serving mocked web service responses from text files. When a file matching the URL path exists, the contents of the file is returned. Otherwise the request is forwarded to the original web service.

## How to use
### Installation
Clone the repository and run "npm install"

### Configuration
Copy the config/default-example.json file and name it config/default.json.
Configure the application by editing the "config/default.json" file.

### Create mocks
Create a new text file in the "mocks-enabled" folder with a mocked web service response. The sub folders and the file name need to match the path of the web service URL. E.g. for a URL like "http://localhost/some/simple/path", the file needs to placed in a folder "mocks-enabled/some/simple" and named "path.txt".

#### POST requests
For POST requests the name of the file is defined by the sha1 hash of the request body. It still needs to be placed in the in the sub folder matching the URL.

### Enabling and disabling mocks
To enable and disable mocks, just move the mock files between the "mock-enabled" and "mock-available" folders.

## Run application
To run the application:

    node app

To run the test application which will always return a standard response use in the dir test:

    node MockTarget.js

## Chrome plugin
A chrome plugin with some nice features like

1. Create mocks directly from captured requests and their corresponding responses which were captured by the mock proxy.
2. Manage existing mocks (activation/deactivation/edit/delete/response preview).
3. Track the last x mocks which were returned by the mock proxy.
4. Create mock sets to group mocks together.
5. Take a look at the mock proxy logs.

can be found here [chrome plugin](https://github.com/JulHorn/mock_proxy_chrome_plugin).


