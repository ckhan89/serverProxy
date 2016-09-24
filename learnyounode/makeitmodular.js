var filtered = require('./filterModule')       
filtered(process.argv[2],process.argv[3],function callback(err, files) {
  if (err) {
    console.log(err)
  } else{
    files.forEach(function (err, file){
      if (err) {
        console.log(err)
      } else {
        console.log(file)
      }
    });
  }
});
