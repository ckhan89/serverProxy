var array = process.argv
var total = 0
if (array.length > 2) {
	for (var i = 2; i < array.length; i++) {
		total += Number(array[i])
	}
}
console.log(total)