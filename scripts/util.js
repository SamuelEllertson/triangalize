
function createArray(length) {
	console.log("createArray() called")

    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function clampInt(val, min, max){
	return Math.min(Math.max(Math.floor(val), min), max - 1)
}


function normalizeMatrix(arr, min, max, maxVal){
	console.log("normalizeMatrix() called")

	for (i = 0; i < arr.length; i++) {
		for (j = 0; j < arr[0].length; j++) {
			arr[i][j] = (arr[i][j] / maxVal) * max + min
		}
	}
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}