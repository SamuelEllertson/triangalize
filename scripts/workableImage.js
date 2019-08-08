
class workableImage{

	constructor(img, defaultWidth){
		console.log("workableImage constructor() called")
		this.defaultWidth = defaultWidth;
		this.defaultPointRadius = 10
		this.defaultPointMass = 1
		this.defaultPointRepulsion = 5
		this.defaultBoundingIntensity = 1
		this.defaultDrag = 0.3;
		this.defaultSeekIntensity = 1
		this.defaultDirDistance = 50

		this.diffRadius = 5

		this.original = img
		this.resized = this.resize(img)
		this.brightnessArr = this.getBrightnessArray(this.resized)
		this.differenceArray
		this.contrastImg = this.createContrastImage(this.resized)
		this.dirrectionArr = this.createDirectionArr()
		this.points = []
		this.mesh
		this.pointCoordArray
		this.meshReady = false
		console.log("Workable image constructed")
	}

	addRandomPoints(num){
		for (var i = 0; i < num; i++) {
			let x = getRandomInt(0, this.resized.width)
			let y = getRandomInt(0, this.resized.height)
			this.points.push(new PolyPoint(x, y, this.resized.width, this.resized.height, this.defaultPointMass, 0, this.defaultPointRadius))
		}
	}

	drawPoints(){
		fill(255)
		stroke(0)
		for(let point of this.points){
			point.draw()
		}
	}

	physics(){
		if(!this.dirrectionArr)
			return

		for(let point1 of this.points){

			point1.addBoundingForce(this.defaultBoundingIntensity)
			point1.addDrag(this.defaultDrag)
			point1.addForce( this.dirrectionArr[clampInt(point1.pos.x, 0, this.resized.width)][clampInt(point1.pos.y, 0, this.resized.height)].newScale(this.defaultSeekIntensity) )

			for(let point2 of this.points){

				if(point1.pos.equals(point2.pos))
					continue
				//console.log(Vector.subtract(point2.pos, point1.pos).scale(1 / point1.pos.distanceSquared(point2.pos)))

				point2.addForce(Vector.subtract(point1.pos, point2.pos).scale(this.defaultPointRepulsion / point1.pos.distanceSquared(point2.pos)))
			}
		}
	}

	updatePoints(){
		for(point of this.points){
			point.update()
		}
	}

	resize(img){
		console.log("Resize() called")

		let temp = createImage(img.width, img.height)
		temp.copy(img, 0,0,img.width, img.height,0,0,img.width, img.height)
		temp.resize(this.defaultWidth, 0)
		return temp
	}

	loopThroughXandY(img, startX, startY, endX, endY, fn){
		for (let x = startX; x < endX; x++) {
			for (let y = startY; y < endY; y++) {
				fn(img, x, y)
			}
		}
	}

	createContrastImage(img){
		console.log("createContrastImage() called")

		let constrastImage = createImage(img.width, img.height)

		let differenceArray = createArray(img.width, img.height)
		
		constrastImage.loadPixels()
		
		let maxDiff = 0
		for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {

				let diffValue = this.getDifferenceValue(img.width, img.height, x, y)

				if(diffValue > maxDiff)
					maxDiff = diffValue

				differenceArray[x][y] = diffValue
			}
		}

		normalizeMatrix(differenceArray, 0, 255, maxDiff)

		this.loopThroughXandY(constrastImage, 0, 0, img.width, img.height, (constrastImage, x, y) => {
			constrastImage.set(x, y, differenceArray[x][y])
		})
		
		constrastImage.updatePixels()

		this.differenceArray = differenceArray
		return constrastImage

	}

	getBrightnessArray(img){
		console.log("getBrightnessArray() called")

		let r,g,b, ind
		let arr = createArray(img.width, img.height)

		img.loadPixels()

		for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {

				ind = 4 * (y * img.width + x)
				r = img.pixels[ind]
				g = img.pixels[ind + 1]
				b = img.pixels[ind + 2]				
				arr[x][y] = (r+r+g+g+g+b)/6
			}
		}

		return arr
	}

	getDifferenceValue(width, height, x, y){
		let acc = 0.0
		let diff = 0.0
		let diffSquared = 0.0

		let minX = (x - this.diffRadius) >=    0  ? x - this.diffRadius : 0
		let maxX = (x + this.diffRadius) <= width ? x + this.diffRadius : width

		let minY = (y - this.diffRadius) >=      0 ? y - this.diffRadius : 0
		let maxY = (y + this.diffRadius) <= height ? y + this.diffRadius : height
		
		for (x = minX; x < maxX; x++) {
			for (y = minY; y < maxY; y++) {
				acc += this.brightnessArr[x][y]
			}
		}

		let average = acc / ((maxX - minX) * (maxY - minY))
		
		for (x = minX; x < maxX; x++) {
			for (y = minY; y < maxY; y++) {
				diff = this.brightnessArr[x][y] - average
				diffSquared += diff * diff
			}
		}

		return diffSquared
	}

	createDirectionArr(){
		let arr = createArray(this.resized.width, this.resized.height)
		let i, acc
		let dirX = 0
		let dirY = 0


		for (let x = 0; x < this.resized.width; x++) {
			for (let y = 0; y < this.resized.height; y++) {
				
				acc = 0 
				dirX = 0
				dirY = 0

				for(i = -this.defaultDirDistance; i < this.defaultDirDistance; i++){ //horizontal
					if((x + i < 0) || (x + i >= this.resized.width) || i == 0)
						continue

					acc += (10 / i) * this.differenceArray[x + i][y]
				}	

				dirX += acc
				acc = 0

				for(i = -this.defaultDirDistance; i < this.defaultDirDistance; i++){ //vertical
					if((y + i < 0) || (y + i >= this.resized.height) || i == 0)
						continue


					acc += (10 / i) * this.differenceArray[x][y + i]
				}	

				dirY += acc

				arr[x][y] = (new Vector(dirX, dirY)).fastUnit()
			}
		}

		return arr
	}

	getPointList(){
		let arr = []

		for(point of this.points){
			arr.push([point.pos.x, point.pos.y])
		}

		return arr
	}

	createMesh(){
		this.pointCoordArray = this.getPointList()

		this.mesh = Delaunator.from(this.pointCoordArray)
		this.meshReady = true
	}

	draw(){
		image(this.contrastImg, 0, 0)
	}

	drawMesh(){
		let points = this.pointCoordArray
		let triangles = this.mesh.triangles
		fill(255, 255, 255, 100)
		stroke(0)
		for (let i = 0; i < triangles.length; i += 3) {

		    triangle(
		    	points[triangles[i    ]][0],points[triangles[i    ]][1],
		    	points[triangles[i + 1]][0],points[triangles[i + 1]][1],
		    	points[triangles[i + 2]][0],points[triangles[i + 2]][1],
	    	)
		}
	}

	drawMeshColored(){

		if(!this.meshReady){
			this.createMesh()
		}

		let points = this.pointCoordArray
		let triangles = this.mesh.triangles

		this.resized.loadPixels()
		strokeWeight(3)
		for (let i = 0; i < triangles.length; i += 3) {
			let centX = (points[triangles[i]][0] + points[triangles[i + 1]][0] + points[triangles[i + 1]][0]) / 3
			let centY = (points[triangles[i]][1] + points[triangles[i + 1]][1] + points[triangles[i + 1]][1]) / 3
			let color = this.resized.get(centX, centY)
			fill(color)
			stroke(color)

		    triangle(
		    	points[triangles[i    ]][0],points[triangles[i    ]][1],
		    	points[triangles[i + 1]][0],points[triangles[i + 1]][1],
		    	points[triangles[i + 2]][0],points[triangles[i + 2]][1],
	    	)
		}
	}
}