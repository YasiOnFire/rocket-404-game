let y_axis = 0
let y_speed = 0.9
let score = 0
let endGame = false
let playing = false
let engine
let world
let ground
let option
let rocket
let rocketTexture
let fuel = 100
const TIME_LIMIT = 3000
const Engine = Matter.Engine
const Render = Matter.Render
const World = Matter.World
const Bodies = Matter.Bodies
const Body = Matter.Body

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
}

function draw() {
	clear()

	translate(0, y_axis)
	rocket.show()
	ground.show()
}

function mousePressed() {
	if (endGame) return
	if (!playing) {
		playing = true
		gameTime = setInterval(() => {
			fuel -= 10
			document.querySelector('#time span').innerHTML = fuel
		}, TIME_LIMIT / 10)
		setTimeout(() => {
			endGame = true
			clearInterval(gameTime)
		}, TIME_LIMIT)
	}
	rocket.go()
	score += 1
	document.querySelector('#score span').innerHTML = score
	document.querySelector('#time span').innerHTML = fuel
}

function Rocket(x, y, wid, hei) {
	this.body = Bodies.rectangle(x, y, wid, hei)
	this.currSpeed = 1

	World.add(world, this.body)

	this.show = function () {
		var pos = this.body.position
		// clear()
		push()
		stroke('#bdbcbd')
		strokeWeight(3)
		fill('#bdbcbd')
		translate(pos.x, pos.y)
		rect(0, 50, wid, hei)
		image(rocketTexture, 0, 50, wid, hei);
		pop()
	}
	this.go = function () {
		var f = {
			x: random(-0.0004, 0.0004),
			y: -0.05
		}

		Body.applyForce(this.body, this.body.position, f)

		// this.body.position.y -= this.currSpeed * 3
		// console.log('this.body.position.y: ', this.body.position)
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
