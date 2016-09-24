var net = require('net')
var strftime = require('strftime')
var server = net.createServer(function (socket) {
	// socket handler
	if (socket) {
		socket.end(strftime('%Y-%m-%d %H:%M',new Date())+"\n")
	}
}).listen(process.argv[2])