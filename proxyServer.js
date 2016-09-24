// Place near the top of your file, just below your other requires
// Set a the default value for --host to 127.0.0.1
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
// Build the destinationUrl using the --host value
// Get the --port value
// If none, default to the echo server port, or 80 if --host exists
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
    // Notice streams are chainable:
    // inpuStream -> input/outputStream -> outputStream
    // req.pipe(request(options)).pipe(res)
    // Log the proxy request headers and content in the **server callback**
    let downstreamResponse = req.pipe(request(options))
    // process.stdout.write(JSON.stringify(downstreamResponse.headers))
    // downstreamResponse.pipe(process.stdout)
    logStream.write('Request headers: ' + JSON.stringify(req.headers))
    downstreamResponse.pipe(logStream, {end: false})
    downstreamResponse.pipe(res)
}).listen(8001)