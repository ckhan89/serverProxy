module.exports = function filteredls(folder,extension,callback) {
	var fs = require('fs')  
    var path = require('path')
    var ext = '.' + extension
    fs.readdir(folder, function (err, files) {  
       if (err) return callback(err,null)
       var filtered = files.filter(function filtering(file){
       		return (path.extname(file) === ext)
       });
       callback(null,filtered);
     });    
}