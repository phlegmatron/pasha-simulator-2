var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    mainElement,
    dropdownElement,
    keyState = {},
    score,
    lives,
    game = {
      start: false,
      over: false
    }

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

function startGame() {
  mainElement = new animation(0, canvas.height - 200, 150, 150, 20);
  dropdownElement = new component(150, 0, 50, 50, 5, './img/beer.jpeg');
  heart = new component(5, 7, 50, 50, 0, './img/heart.png');
  score = 0;
  lives = 3;
  drawFrame();
}

window.onkeydown = (event) => {
  if (event.keyCode === 13) {
    if (!game.start) {
      game.start = true;
      menu.classList.toggle('display-none');
      startGame();
    } else if (game.over) {
        gameover.classList.toggle('display-none');
        startGame();
    }
  }
  keyState[event.keyCode] = true;
}
window.onkeyup = (event) => {
  keyState[event.keyCode] = false;
}

function component(x, y, width, height, speed, imageSrc) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.width = width;
  this.height = height;
  this.image = new Image;
  this.image.src = imageSrc;
  this.update = () => {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
  this.crashWith = (otherobj) => {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
           (mytop > otherbottom) ||
           (myright < otherleft) ||
           (myleft > otherright)) {
       crash = false;
    }
    return crash;
  }
}

function animation(x, y, width, height, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.width = width;
  this.height = height;
  this.frame = 0;
  this.frameSize = 125;
  this.frameX = 0;
  this.frameY = 0;
  this.frameCount = 0;
  var spriteSheet = new Image;
  spriteSheet.src = './img/move-animation.jpg'
  this.image = spriteSheet;
  this.update = () => {
    if (this.frameX > 3) {
      this.frameX = 0;
      this.frameY++
    }
    if (this.frameY > 1) {
      this.frameY = 0;
    }
    ctx.drawImage(this.image, (this.frameX * this.frameSize), (this.frameY * this.frameSize), this.frameSize, this.frameSize, this.x, this.y, this.width, this.height)
  }
  this.crashWith = (otherobj) => {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
           (mytop > otherbottom) ||
           (myright < otherleft) ||
           (myleft > otherright)) {
       crash = false;
    }
    return crash;
  }
}

function clearFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawFrame() {
  clearFrame();
  if (keyState[37] && mainElement.x > 0) {
    mainElement.x -= mainElement.speed;
    mainElement.frameX++;
  }
  if (keyState[39] && mainElement.x < (canvas.width - mainElement.width) ) {
    mainElement.x += mainElement.speed;
    mainElement.frameX++;
  }
  if (dropdownElement.y === -dropdownElement.height) dropdownElement.x = getRandomNumber(0, canvas.width - dropdownElement.width);
  dropdownElement.y += dropdownElement.speed
  if ((dropdownElement.y + dropdownElement.height) > canvas.height) {
    if (lives > 1) {
      dropdownElement.y = -dropdownElement.height;
      lives--
    } else {
      game.over = true;
      gameover.classList.toggle('display-none');
      return;
    }
  }
  if (mainElement.crashWith(dropdownElement)) {
    dropdownElement.y = -dropdownElement.height;
    score++
    dropdownElement.speed += score / 100
  }
  ctx.font = '30px "Press Start 2p"';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText("SCORE", canvas.width / 2, 50);
  ctx.fillText(score, canvas.width / 2, 100);
  for (let i = 1; i <= lives; i++) {
    heart.update();
    heart.x = heart.width * i + 5;
  }
  heart.x = 5;
  mainElement.update();
  dropdownElement.update();
  requestAnimationFrame(drawFrame);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}