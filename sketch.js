let y_axis = 0
let y_speed = 0.9
let score = 0
let hiscore = 0
let endGame = false
let playing = false
let readyToPlay = false
let engine
let world
let ground
let stars = []
let option
let particleSystem
let rocket
let rocketTexture
let fuel = 100
const TIME_LIMIT = 5000
const Engine = Matter.Engine
const Render = Matter.Render
const World = Matter.World
const Bodies = Matter.Bodies
const Body = Matter.Body

document.getElementById('restartGame').addEventListener('click', function (e) {
	document.querySelector('#status').innerHTML = 'Filling tank...'
	fuel = 100
	score = 0
	endGame = false
	playing = false
	readyToPlay = false

	setTimeout(function () {
		document.querySelector('#status').innerHTML = '...done...'
	}, 1000)
	setTimeout(function () {
		document.querySelector('#status').innerHTML = 'Get Ready!'
	}, 1500)

	setTimeout(function () {
		document.querySelector('#status').innerHTML = 'Set!'
	}, 2000)

	setTimeout(function () {
		document.querySelector('#status').innerHTML = 'GO... Spam left click to fly'
		readyToPlay = true
	}, 2500)
	rocket.previousHeight = height
	document.querySelector('#score span').innerHTML = score
	document.querySelector('#time span').innerHTML = fuel
	document.getElementById('restartGame').classList.add('hidden')
})

if (localStorage.getItem('hiscorerocket')) {
	hiscore = localStorage.getItem('hiscorerocket')
	document.querySelector('#hiscore span').innerHTML = hiscore
}

function preload() {
	rocketTexture = loadImage('rocket.png');
}

function setup() {
	createCanvas(window.innerWidth, window.innerHeight)
	engine = Engine.create()
	world = engine.world
	Engine.run(engine)
	ground = new Ground(height - 100)

	for (let x = 0; x < width / 10; x++) {
		stars.push(new Star())
	}
	rocket = new Rocket(width - (width / 3), 10, 50, 100)
	setTimeout(function () {
		readyToPlay = true
	}, 2000)
	particleSystem = new ParticleSystem(createVector(0, 0))
}

function draw() {
	clear()
	translate(0, rocket.body.position.y * -0.01)
	for (let x = 0; x < stars.length; x++) {
		stars[x].show()
	}
	translate(0, (rocket.body.position.y * -1) + (height - 220))
	translate(0, (rocket.body.position.y * 0.1) - 80)
	ground.show()
	rocket.show()
	translate(rocket.body.position.x + 25, rocket.body.position.y + 150)
	particleSystem.run()
}

function mousePressed() {
	if (!readyToPlay) return
	if (endGame) {
		document.getElementById('restartGame').classList.remove('hidden')
		return
	}
	if (!playing) {
		playing = true
	}
	if (fuel <= 0) {
		fuel = 0
		endGame = true
	} else {
		rocket.go()
		fuel -= Math.round(random(0, 4))
		document.querySelector('#time span').innerHTML = fuel
	}
}

class Rocket {
	constructor(x, y, wid, hei) {
		this.body = Bodies.rectangle(x, y, wid, hei, {
			restitution: .3,
			friction: 1
		})
		this.currSpeed = 1
		this.previousHeight = height
		this.wid = wid
		this.hei = hei
		World.add(world, this.body)
	}
	show() {
		var pos = this.body.position;
		// clear()
		push()
		noStroke()
		// fill('#bdbcbd')
		noFill()
		translate(pos.x, pos.y)
		rect(0, 50, this.wid, this.hei)
		image(rocketTexture, 0, 50, this.wid, this.hei)
		pop()
	}
	go() {
		var f = {
			x: random(-0.0004, 0.0004),
			y: -0.05
		}
		particleSystem.addParticle()
		Body.applyForce(this.body, this.body.position, f)
		if (this.body.position.y < this.previousHeight) {
			this.previousHeight = this.body.position.y
			score = Math.round(height - this.body.position.y) * 55
			document.querySelector('#score span').innerHTML = score
			if (score > hiscore) {
				hiscore = score
				localStorage.setItem('hiscorerocket', hiscore)
				document.querySelector('#hiscore span').innerHTML = hiscore
			}
		}
	}
}

class Ground {
	constructor(y) {
		this.body = Bodies.rectangle(0, height - 100, width + 2500, 100, {
			isStatic: true,
			restitution: .1,
			friction: 10
		});
		World.add(world, this.body)
	}
	show() {
		push()
		stroke('#353238')
		strokeWeight(3)
		noFill()
		rect(0, height - 50, width, 100)
		fill('#353238')

		angleMode(DEGREES)
		//rotate(-45)
		for (let x = 0; x < width / 10; x++) {
			noStroke()
			//rect(0 + x * 20, height + x * 20, 1, 80)
			rect(0 + x * 20, height - 50, 1, 100)
		}
		pop()
	}
}

class Star {
	constructor() {
		this.x = random(width / 2, width - 100)
		this.y = random(-2000, height)
		this.r = random(2, 10)
	}
	show() {
		push()
		noStroke()
		fill('#353238')
		ellipse(this.x, this.y, this.r)
		pop()
	}
}

// A simple Particle class from p5 docs by Daniel Shiffman just converted it to ES5 classes :)
class Particle {
	constructor(position) {
		this.acceleration = createVector(0, 0.05)
		this.velocity = createVector(random(-1, 1), random(-1, 0))
		this.position = position.copy()
		this.lifespan = 155
	}
	run() {
		this.update()
		this.display()
	}
	// Method to update position
	update() {
		this.velocity.add(this.acceleration)
		this.position.add(this.velocity)
		this.lifespan -= 2
	}
	// Method to display
	display() {
		stroke(118, 21, 227, this.lifespan)
		strokeWeight(2)
		fill(118, 21, 227, this.lifespan)
		ellipse(this.position.x, this.position.y, 12, 12)
	}
	// Is the particle still useful?
	isDead() {
		return this.lifespan < 0
	}
}

class ParticleSystem {
	constructor(position) {
		this.origin = position.copy()
		this.particles = []
	}
	addParticle() {
		this.particles.push(new Particle(this.origin))
	}
	run() {
		for (var i = this.particles.length - 1; i >= 0; i--) {
			var p = this.particles[i]
			p.run()
			if (p.isDead()) {
				this.particles.splice(i, 1)
			}
		}
	}
}
