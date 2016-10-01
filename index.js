let http = require('http')
let url = require('url')
let argv = require('yargs')
    .default('host', '127.0.0.1:8000')
    .argv
// echo server
http.createServer((req, res) => {
    console.log(`Request received at: ${req.url}`)
    for(let header in req.headers){
    	res.setHeader(header,req.headers[header])
    }
    req.pipe(res)
}).listen(8000)

// proxy server
let request = require('request')
let path = require('path')
let fs = require('fs')
let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout

let scheme = 'http://'
let port = argv.port || (argv.host === '127.0.0.1' ? 8000 : 80)
// update destinationUrl
let destinationUrl = argv.url|| url.format({
       protocol: 'http',
       host: argv.host,
       port
    })
// proxy server
http.createServer((req,res)=>{
	// allow the x-destination-url header to override the destinationUrl value
	destinationUrl = req.headers['x-destination-url']? req.headers['x-destination-url']:destinationUrl
    console.log(`Proxying request to: ${destinationUrl + req.url}`)
	// Proxy code
    let options = {
        header: req.headers,
        url: `${destinationUrl}${req.url}`
    }
    options.method = req.method
    let outboundResponse = request(options)
    req.pipe(outboundResponse)

    req.pipe(logStream, {end: false})
	logStream.write('Request headers: ' + JSON.stringify(req.headers))
    outboundResponse.pipe(res)
}).listen(8001)
