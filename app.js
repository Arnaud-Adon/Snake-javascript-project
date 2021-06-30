var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

let snake = [
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
  { x: 100, y: 150 },
];

let vx = 10;
let vy = 0;
let appleX = 0;
let appleY = 0;
let score = 0;
let directionBug = false;
let stopGame = false;

function drawSnakePart(part) {
  ctx.fillStyle = "#00fe14";
  ctx.strokeStyle = "black";
  ctx.fillRect(part.x, part.y, 10, 10);
  ctx.strokeRect(part.x, part.y, 10, 10);
}

createApple();
function animation() {
  if (stopGame) {
    return;
  } else {
    setTimeout(() => {
      directionBug = false;
      clearCanvas();
      forwardSnake();
      drawSnake();
      appleDraw();
      animation();
    }, 100);
  }
}

animation();

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "red";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part) => {
    drawSnakePart(part);
  });
}

function forwardSnake() {
  const head = { x: snake[0].x + vx, y: snake[0].y + vy };
  snake.unshift(head);

  if (endGame()) {
    snake.shift(head);
    stopGame = true;
    resetGame();
    return;
  }

  const eatApple = snake[0].x === appleX && snake[0].y === appleY;
  if (eatApple) {
    score += 10;
    document.getElementsByClassName("score_number")[0].innerHTML = score;
    createApple();
  } else {
    snake.pop();
  }
}

// forwardSnake();
// drawSnake();

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  console.log(event);
  if (directionBug) return;
  directionBug = true;
  const LEFT_ARROW = 37;
  const UP_ARROW = 38;
  const RIGHT_ARROW = 39;
  const DOWN_ARROW = 40;
  //   const STOP_FORWARD = 83;
  const SPACE = 32;

  const direction = event.keyCode;

  const up = vy === -10;
  const down = vy === 10;
  const right = vx === 10;
  const left = vx === -10;

  if (direction === LEFT_ARROW && !right) {
    vx = -10;
    vy = 0;
  }

  if (direction === UP_ARROW && !down) {
    vx = 0;
    vy = -10;
  }

  if (direction === RIGHT_ARROW && !left) {
    vx = 10;
    vy = 0;
  }
  if (direction === DOWN_ARROW && !up) {
    vx = 0;
    vy = 10;
  }

  //   if (direction === STOP_FORWARD) {
  //     vx = 0;
  //     vy = 0;
  //   }
}

function random() {
  return Math.round((Math.random() * 290) / 10) * 10;
}

function createApple() {
  appleX = random();
  appleY = random();

  snake.forEach((part) => {
    const eatApple = part.x === appleX && part.y === appleY;

    if (eatApple) {
      createApple();
    }
  });
}

function appleDraw() {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "darkred";
  ctx.fillRect(appleX, appleY, 10, 10);
  ctx.beginPath();
  ctx.arc(appleX + 5, appleY + 5, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function endGame() {
  let snakeWithoutHead = snake.slice(1, -1);
  let snakeBite = false;

  snakeWithoutHead.forEach((part) => {
    if (part.x === snake[0].x && part.y === snake[0].y) snakeBite = true;
  });

  const leftWallTouch = snake[0].x < -1;
  const rightWallTouch = snake[0].x > canvas.height - 10;
  const upWallTouch = snake[0].y < -1;
  const downWallTouch = snake[0].y > canvas.height - 10;

  let gameOver = false;

  if (
    snakeBite ||
    leftWallTouch ||
    rightWallTouch ||
    upWallTouch ||
    downWallTouch
  ) {
    gameOver = true;
  }

  return gameOver;
}

function resetGame() {
  const restart = document.getElementById("restart");
  restart.style.display = "block";

  document.getElementsByClassName("end_message")[0].innerHTML = "Fin de partie";

  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 32) {
      document.location.reload();
    }
  });
}

// Pour eviter le bug, on instautre une variable qui durant le processus de l'animation sera initie a une valeur
