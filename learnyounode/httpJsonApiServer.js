var http = require('http')
var url = require('url')
var server = http.createServer(function (req,res) {
	// body...
	var object = url.parse(req.url,true)
	var date = new Date(object.query.iso)
	console.log(object.pathname)
	if (object.pathname == '/api/parsetime') {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		var data = {
			"hour":date.getHours(),
			"minute":date.getMinutes(),
			"second":date.getSeconds()
		}
		res.end(JSON.stringify(data))

	} else if (object.pathname == '/api/unixtime') {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		var data = {"unixtime": date.getTime()}
		res.end(JSON.stringify(data))
	} else{
		res.writeHead(404);
		res.end("Request is not correct format");
	}
})
server.listen(Number(process.argv[2]))