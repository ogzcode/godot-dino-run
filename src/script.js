const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const MARGIN = 10;

const levels = {
	level_1: [
		"11111111",
		"01111110",
		"00111100",
		"00011000"],
	
	level_2: [
		"11111111",
		"11100111",
		"11000011",
		"10000001"],

	level_3: [
		"11111111",
		"11000011",
		"11000011",
		"11111111"],
		
	level_4: [
		"01111110",
		"00111100",
		"00111100",
		"01111110"],

	level_5: [
		"11011011",
		"10111101",
		"10111101",
		"11011011"],
	
	level_6: [
		"10000001",
		"11111111",
		"11111111",
		"10000001"],
	
	level_7: [
		"11000011",
		"00111100",
		"00111100",
		"11000011"]
};

const colors = ["#ff2d2d", "#2d6fff", "#fff50b"];


class Brick {
	constructor(posX, posY, color){
		this.width = 40;
		this.height = 15;
		this.x = posX * (this.width + MARGIN) + MARGIN / 2;
		this.y = posY * (this.height + MARGIN) + MARGIN;
		this.deleteState = false;
		this.color = color;
	}
	
	draw(cx){
		cx.save();
		cx.fillStyle = this.color;
		cx.beginPath();
		cx.rect(this.x, this.y, this.width, this.height);
		cx.fill();
		cx.restore()
	}
}


class Bricks {
	constructor(){
		this.brickList = [];
		this.width = 40;
		this.height = 15;
	}	
	createWithLevel(){
		let number = Math.floor(Math.random() * 7);
		this.brickList.splice(0, this.brickList.length);
		for (let y = 0; y < 4; y++){
			for (let x = 0; x < 8; x++){
				if (levels[`level_${number + 1}`][y][x] == '0') continue;
				
				let colorCode = colors[Math.floor(Math.random() * colors.length)];

				this.brickList.push(new Brick(x, y, colorCode));
			}
		}
	}
	draw(cx){
		for (let brick of this.brickList){
			brick.draw(cx);
		}
	}
}


class Paddle {
	constructor(){
		this.width = 80;
		this.height = 5;
		this.x = 0;
		this.y = canvas.height - this.height - 10;
	}
	
	draw(cx){
		cx.save();
		cx.fillStyle = "white";
		cx.beginPath();
		cx.rect(this.x, this.y, this.width, this.height);
		cx.fill();
		cx.restore();
	}
	
	update(mouseX){
		this.x = mouseX;
		
		if (this.x <= 0) this.x = 0;
		else if (this.x >= canvas.width - this.width) this.x = canvas.width - this.width;
	}
}


class Ball {
	constructor(){
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.rad = 10;
		this.speedX = 5;
		this.speedY = 3;
	}
	
	update(){
		this.x += this.speedX;
	
		if (this.x - this.rad <= 0 || this.x + this.rad >= canvas.width){
			this.speedX *= -1;
		}
		
		this.y += this.speedY;
		
		if (this.y - this.rad <= 0){
			this.speedY *= -1;
		}
	}
	
	draw(cx){
		cx.save();
		cx.fillStyle = "white";
		cx.beginPath();
		cx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
		cx.fill();
		cx.restore();
	}
	
	reset(){
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = 5;
		this.speedY = 3;
	}
}


function brickAndBallCollision(rectObjects, ballObject){
	for (let rect of rectObjects){
		let result = collisionTest(rect, ballObject);
		
		change(result, rect, ballObject);
		
		if (result != ""){
			rect.deleteState = true;
			let index = rectObjects.indexOf(rect);
			rectObjects.splice(index, 1);
			score += 1;
			updateScore(score);
		}
		
	}
}

function updateScore(scr){
	const node = document.querySelector("span");
	node.innerText = `Score : ${scr}`;
}


function change(result, rect, ballObject){
	if (result == "right"){
		ballObject.x = rect.x + rect.width + ballObject.rad;
		ballObject.speedX *= -1;
	}
	else if (result == "left"){
		ballObject.x = rect.x - ballObject.rad;
		ballObject.speedX *= -1;
	}
	else if (result == "top"){
		ballObject.y = rect.y - ballObject.rad;
		ballObject.speedY *= -1;
	}
	else if (result == "down"){
		ballObject.y = rect.y + rect.height + ballObject.rad;
		ballObject.speedY *= -1;
	}
}


function collisionTest(rect, ballObject){
	let direction = "";
	
	let testX = ballObject.x;
	let testY = ballObject.y;
	
	if (ballObject.x < rect.x){
        testX = rect.x;
    }
    else if (ballObject.x > rect.x + rect.width){
		testX = rect.x + rect.width;
    }

    if (ballObject.y < rect.y){
		testY = rect.y;
    }
    else if (ballObject.y > rect.y + rect.height){
		testY = rect.y + rect.height;
    }
	
	let distX = ballObject.x - testX;
    let distY = ballObject.y - testY;
    let distance = Math.sqrt((distX * distX) + (distY * distY));
	
	if (distance <= ballObject.rad){
        if (Math.abs(distX) > Math.abs(distY)){
			direction = distX > 0 ? "right" : "left";
        }
        else if (Math.abs(distY) > Math.abs(distX)){
            direction = distY > 0 ? "down" : "top";
        }
    }
	
	return direction;
}


function resetControl(ballObject, brickObjects){
	const array = [ball.y + ball.rad >= canvas.height, bricks.brickList.length == 0]
	if (array[0] || array[1]){
		if (array[0]) {
			score = 0;
			updateScore(0);
		}
		ball.reset();
		bricks.createWithLevel();
	}
}


function frame(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	bricks.draw(context);
	
	player.draw(context);
	
	ball.draw(context);
	ball.update();
	
	resetControl(ball, bricks);
	
	brickAndBallCollision(bricks.brickList, ball);
	change(collisionTest(player, ball), player, ball);

}

const bricks = new Bricks();
bricks.createWithLevel();

const player = new Paddle();
const ball = new Ball();

var score = 0;

canvas.addEventListener("mousemove", event => {
	let x = event.clientX - event.target.offsetLeft;
	player.update(x);
});

setInterval(frame, 1000 / 50);