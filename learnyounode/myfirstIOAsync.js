var fs = require('fs')
if (process.argv.length > 2) {
	var buf = fs.readFile(process.argv[2],'utf8',function callback(err, data){
		if (!err && data) {
			var str = data.toString()
			var array = str.split('\n')
			console.log(array.length - 1)
		}
	});
}