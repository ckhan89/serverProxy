let http = require('http')
let https = require('https')
let url = require('url')
let request = require('request')
let path = require('path')
let fs = require('fs')
let chalk = require('chalk')
let argv = require('yargs')
    .options({
        host: {
            default:'127.0.0.1:8000',
            alias: 'x',
            describe: 'Specify a forwarding host ssl'
        },
        port:{
            alias:'p',
            describe:'Specify a forwarding port'
        },
        'host-ssl': {
            demand: false,
            alias:'H',
            describe:'Specify a forwarding host ssl'
        },
        'port-ssl':{
            alias:'P',
            describe:'Specify a forwarding port of ssl'
        },
        log:{
            demand: false,
            alias:'l',
            describe:'Specify a output log file'
        },
        help:{
            alias:'h',
            describe:'Show help'
        }
    })
    .usage('Usage: node ./index.js [options]')
    .help('h')
    .example('node index.js -P 80 -H facebook.com')
    .epilog('copyright by Han Cao 2016')
    .argv
let options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('key-cert.pem')
};
// echo server
http.createServer((req, res) => {
    console.log(`Request received at: ${req.url}`)
    for (let header in req.headers) {
        res.setHeader(header, req.headers[header])
    }
    req.pipe(res)
}).listen(8000)
// proxy server
let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout

let scheme = argv['host-ssl']? 'https':'http'
let port = argv.port || (argv.host === '127.0.0.1' ? 8000 : 80)
// add --host-ssl and --port-ssl
let host = argv['host-ssl']? argv['host-ssl']:argv.host
let finalPort = argv['host-ssl']? (argv['port-ssl']? argv['port-ssl']:80): port
// update destinationUrl
let destinationUrl = argv.url|| url.format({
       protocol: scheme,
       host: host,
       finalPort
    })
// handler for proxy server
var  handler = function (req,res) {
    // allow the x-destination-url header to override the destinationUrl value
    destinationUrl = req.headers['x-destination-url']? req.headers['x-destination-url']:destinationUrl
    console.log(chalk.blue.italic(`Proxying request to: ${destinationUrl + req.url}`))
    // Proxy code
    let options = {
        header: req.headers,
        url: `${destinationUrl}${req.url}`
    }
    options.method = req.method
    let outboundResponse = request(options)
    req.pipe(outboundResponse)

    req.pipe(logStream, {end: false})
    logStream.write(chalk.yellow.bold('Request headers: ') + chalk.green(JSON.stringify(req.headers)))
    outboundResponse.pipe(res)
}
// check --host-ssl to listen
argv['host-ssl']? https.createServer(options,handler).listen(8001):http.createServer(handler).listen(8001)