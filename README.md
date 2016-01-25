# node-mock-proxy
A simple proxy server for serving mocked web service responses from text files. When a file matching the URL path exists, the contents of the file is returned. Otherwise the request is forwarded to the original web service.

## How to use
### Configuration
Configure the application by editing the config file "config/default.json".

### Create mocks
Create a new file in the "mocks" folder with a mocked web service response. The sub folders and the file name need to match the path of the web service URL. E.g. for a URL like "http://localhost/some/simple/path", the file needs to placed in a folder "mocks/some/simple" and named "path.txt".  

### Run application
To run the application:

    node app
