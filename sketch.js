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
let option
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
	fuel = 100
	score = 0
	endGame = false
	playing = false
	readyToPlay = false
	setTimeout(function () {
		readyToPlay = true
	}, 6000)
	rocket.previousHeight = height
	document.querySelector('#score span').innerHTML = score
	document.querySelector('#time span').innerHTML = fuel
	document.getElementById('restartGame').classList.add('hidden')
});

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
	rocket = new Rocket(width - (width / 3), 10, 50, 100)
	setTimeout(function () {
		readyToPlay = true
	}, 2000)
}

function draw() {
	clear()

	translate(0, y_axis)
	rocket.show()
	ground.show()
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
	// document.querySelector('#time span').innerHTML = fuel
}

function Rocket(x, y, wid, hei) {
	this.body = Bodies.rectangle(x, y, wid, hei, {
		restitution: .6
	})
	this.currSpeed = 1
	this.previousHeight = height

	World.add(world, this.body)

	this.show = function () {
		var pos = this.body.position
		// clear()
		push()
		stroke('#bdbcbd')
		strokeWeight(3)
		fill('#bdbcbd')
		translate(pos.x, pos.y)
		// rect(0, 50, wid, hei)
		image(rocketTexture, 0, 50, wid, hei);
		pop()
	}
	this.go = function () {
		var f = {
			x: random(-0.0004, 0.0004),
			y: -0.05
		}

		Body.applyForce(this.body, this.body.position, f)
		if (this.body.position.y < this.previousHeight) {
			this.previousHeight = this.body.position.y
			score = Math.round(height - this.body.position.y) * 10
			document.querySelector('#score span').innerHTML = score
			if (score > hiscore) {
				hiscore = score
				localStorage.setItem('hiscorerocket', hiscore)
				document.querySelector('#hiscore span').innerHTML = hiscore
			}
		}
	}
}

function Ground(y) {
	this.body = Bodies.rectangle(0, height - 100, width + 2500, 100, {
		isStatic: true,
		friction: 1
	})

	World.add(world, this.body)

	this.show = function () {
		push()
		stroke('#353238')
		strokeWeight(3)
		// fill('#353238')
		noFill()
		rect(0, height - 50, width, 100)
		//translate(-600, 175)
		fill('#353238')
		angleMode(DEGREES)
		//rotate(-45)
		for (let x = 0; x < width / 10; x++) {
			noStroke()
			//rect(0 + x * 20, height + x * 20, 1, 80)
			rect(0 + x * 20, height - 50, 1, 80)
		}
		pop()
	}
}
