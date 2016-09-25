let argv = require('yargs')
    .default('host', '127.0.0.1:8000')
    .argv
let http = require('http')
let request = require('request')
let path = require('path')
let fs = require('fs')
let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout

let scheme = 'http://'
let port = argv.port || (argv.host === '127.0.0.1' ? 8000 : 80)

// Update our destinationUrl line from above to include the port
let destinationUrl = scheme  + argv.host + ':' + port
// proxy server
http.createServer((req,res)=>{
    console.log(`Proxying request to: ${destinationUrl + req.url}`)
    req.pipe(process.stdout)
    // Proxy code
    let options = {
        header: req.headers,
        url: `${destinationUrl}${req.url}`
    }
    options.method = req.method
    let downstreamResponse = req.pipe(request(options))
    logStream.write('Request headers: ' + JSON.stringify(req.headers))
    downstreamResponse.pipe(logStream, {end: false})
    downstreamResponse.pipe(res)
}).listen(8001)
