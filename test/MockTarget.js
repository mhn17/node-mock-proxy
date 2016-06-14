var express = require('express');
var app = express();

// handle POST requests
app.post("/*", function (req, res) {
	res.send(
		  '<?xml version="1.0"?>'
		+ '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2001/12/soap-envelope" SOAP-ENV:encodingStyle="http://www.w3.org/2001/12/soap-encoding" >'
		+ '  <SOAP-ENV:Body xmlns:m="http://www.xyz.org/quotation" >'
		+ '    <m:GetQuotationResponse>'
		+ '      <m:Quotation>Here is the quotation</m:Quotation>'
		+ '    </m:GetQuotationResponse>'
		+ '  </SOAP-ENV:Body>'
		+ '</SOAP-ENV:Envelope>')
});

// start server
app.listen(8099, function () {
	console.log('Mock server listening on port ' + 8099);
});

