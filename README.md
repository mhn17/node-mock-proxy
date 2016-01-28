# node-mock-proxy
A simple proxy server for serving mocked web service responses from text files. When a file matching the URL path exists, the contents of the file is returned. Otherwise the request is forwarded to the original web service.

## How to use
### Configuration
Copy the config/default-example.json file and name it config/default.json.
Configure the application by editing the "config/default.json" file.

### Create mocks
Create a new file in the "mocks" folder with a mocked web service response. The sub folders and the file name need to match the path of the web service URL. E.g. for a URL like "http://localhost/some/simple/path", the file needs to placed in a folder "mocks/some/simple" and named "path.txt".  

### Run application
To run the application:

    node app
