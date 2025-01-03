const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const overlay = document.getElementById("overlay");
const tryAgainButton = document.getElementById("tryAgainButton");
const outGameButton = document.getElementById("outGameButton");
const box = 20;
let snake, direction, food, score, game;

window.onload = () => {
  overlay.style.display = "none";
  canvas.style.display = "none";
};

startButton.addEventListener("click", startCountdown);
tryAgainButton.addEventListener("click", restartGame);
outGameButton.addEventListener("click", outGame);

function startCountdown() {
  let countdown = 3;
  startButton.style.display = "none";
  canvas.style.display = "block";

  const countdownInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = '60px "Courier New", monospace';
    ctx.textAlign = "center";
    ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);

    countdown--;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      startGame();
    }
  }, 1000);
}

function startGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
  score = 0;
  game = setInterval(draw, 100);
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
  if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
  if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
  if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeX >= canvas.width ||
    snakeY < 0 ||
    snakeY >= canvas.height ||
    collision(newHead, snake.slice(1))
  ) {
    clearInterval(game);
    showGameOver();
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.font = '20px "Courier New", monospace';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function showGameOver() {
  overlay.style.display = "flex";
}

function restartGame() {
  overlay.style.display = "none";
  startCountdown();
}

function outGame() {
  overlay.style.display = "none";
  canvas.style.display = "none";
  startButton.style.display = "block";
}
