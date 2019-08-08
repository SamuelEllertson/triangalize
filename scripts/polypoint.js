
class PolyPoint{

	constructor(x, y, maxX, maxY, mass, locked, radius){
		this.pos = new Vector(x, y)
		this.initialPos = new Vector(x, y)
		this.maxPos = new Vector(maxX, maxY)
		this.vel = new Vector(0,0)
		this.acc = new Vector(0,0)
		this.mass = mass
		this.inverseMass = 1 / mass
		this.locked = locked
		this.radius = radius
	}

	update(){
		if(this.locked)
			return

		this.vel.add(this.acc)
		this.acc.clear()

		this.pos.add(this.vel).limit(this.maxPos)
		//this.vel.clear()
	}

	addForce(force){
		this.acc.add(force.scale(this.inverseMass))
	}

	addDrag(intensity){
		this.addForce(this.vel.negative().scale(intensity))
	}

	addBoundingForce(intensity){
		//this.addForce(Vector.subtract(this.pos, this.initialPos).scale(this.pos.distanceSquared(this.initialPos) * intensity))
		this.addForce(Vector.subtract(this.pos, this.initialPos).scale(intensity))
	}

	setMass(mass){
		this.mass = mass
		this.inverseMass = 1 / mass
	}

	lock(){
		this.locked = true
	}

	unlock(){
		this.locked = false
	}

	draw(){
		ellipse(this.pos.x, this.pos.y, this.radius, this.radius)
	}
}