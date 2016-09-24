var http = require('http')
var fs = require('fs')

var server = http.createServer(function (req,res) {
	// body...
	var readStream = fs.createReadStream(process.argv[3])
	readStream.on('open',function(){
		readStream.pipe(res)
	})
	readStream.on('error',function(error){
		res.end(error)
	})
})
server.listen(process.argv[2])