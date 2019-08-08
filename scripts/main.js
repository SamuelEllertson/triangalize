
let img
let workImg
let defaultWidth = 700
let update, repulsion, bounding, attraction
let repulsionP, boundingP, attractionP
let meshButton, colorMeshButton
let continuousMesh, showMesh, showPoints

let drawColoredMesh = false

function preload() {
  img = loadImage('img/test2.jpg');
}

function setup() {
  createCanvas(defaultWidth, defaultWidth)
  pixelDensity(1)
  background(150)
  textSize(40)
  textAlign(CENTER, CENTER);

  update = createCheckbox("Physics", true).position(defaultWidth + 20, 20)

  repulsion  = createSlider(0, 2, 1, 0.05).position(defaultWidth + 20, 50)
  repulsionP = createP("Repulsion: " + repulsion.value()).position(defaultWidth + repulsion.width  + 40, 35)

  bounding  = createSlider(0.001, 0.05, 0.005, 0.001).position(defaultWidth + 20, 80)
  boundingP = createP("Bounding: " + bounding.value()).position(defaultWidth + bounding.width  + 40, 65)

  attraction  = createSlider(0.1, 5, 1, 0.1).position(defaultWidth + 20, 110)
  attractionP = createP("Attraction: " + attraction.value()).position(defaultWidth + attraction.width  + 40, 95)

  workImg = new workableImage(img, defaultWidth)
  
  meshButton = createButton("Create Mesh").position(defaultWidth + 20, 145).mousePressed(createMesh)
  colorMeshButton = createButton("Toggle Mesh Color").position(defaultWidth + 130, 145).mousePressed(createColoredMesh)

  continuousMesh = createCheckbox("Continuous Mesh", false).position(defaultWidth + 100, 20)
  showMesh = createCheckbox("Show Mesh", true).position(defaultWidth + 240, 20)
  showPoints = createCheckbox("Show Points", true).position(defaultWidth + 340, 20)



  workImg.addRandomPoints(2500)

}

function draw() {
  background(150)

  repulsionP.html("Repulsion: " + repulsion.value())
  boundingP.html("Bounding: " + bounding.value())
  attractionP.html("Attraction: " + attraction.value())

  workImg.defaultPointRepulsion = repulsion.value()
  workImg.defaultBoundingIntensity = bounding.value()
  workImg.defaultSeekIntensity = attraction.value()

  if(update.checked()){
    workImg.physics()
    workImg.updatePoints()
  }

  workImg.draw()

  if(showPoints.checked()){
    workImg.drawPoints()
  }

  if(continuousMesh.checked() && showMesh.checked()){
    workImg.createMesh()
  }

  if(workImg.meshReady && showMesh.checked()){

    if(drawColoredMesh){
      workImg.drawMeshColored()
    }
    else{
      workImg.drawMesh()
    }
  }

}

function createMesh(){
  workImg.createMesh()
}

function createColoredMesh(){
  drawColoredMesh = !drawColoredMesh
}
