"use strict";

const Color = {
  canvas: `hsl(30, 5%, 94%)`,
  dry: `hsla(0, 0%, 100%, 0.03)`,
  paint: `hsl(150, 5%, 5%)`
}

const [WIDTH, HEIGHT] = [512, 512];

const lerp = (x, y, t) => x + t * (y - x);

const canvas = document.createElement('canvas');
canvas.id = 'buddraw';
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

ctx.fillStyle = Color.canvas;
ctx.fillRect(0, 0, WIDTH, HEIGHT);
ctx.fillStyle = Color.paint;

const brush = {
  pressed: 0,
  x: 0, y: 0
};

const paint = () => {
  ctx.fillStyle = Color.paint;
  if (brush.pressed <= 0) return;
  ctx.beginPath();
  ctx.arc(brush.x, brush.y, 4, 0, Math.PI * 2);
  ctx.fill();
};
const dry = () => {
  ctx.fillStyle = Color.dry;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
};

const pressBrush = () => {
  brush.pressed = 1;
  addEventListener('mouseup', releaseBrush);
  addEventListener('mouseleave', releaseBrush);
};
const releaseBrush = () => {
  brush.pressed = 0;
  removeEventListener('mouseup', releaseBrush);
  removeEventListener('mouseleave', releaseBrush);
};
const moveBrush = (x, y) => {
  const [prevX, prevY] = [brush.x, brush.y];
  const dist = Math.sqrt(Math.pow(prevX - x, 2) + Math.pow(prevY - y, 2));
  if (Math.abs(dist) > 1) {
    for (let i = 0; i < dist; i += 1) {
      brush.x = lerp(prevX, x, i / dist);
      brush.y = lerp(prevY, y, i / dist);
      paint();
    }
  }
  brush.x = x;
  brush.y = y;
};
const handleMouseMove = (event) => {
  const diffX = event.clientX - canvas.offsetLeft;
  const diffY = event.clientY - canvas.offsetTop;
  moveBrush(diffX, diffY);
}

let lastTime = 0;

const tick = (time) => {
  if (time - lastTime > 250) {
    lastTime = time;
    paint();
    dry();
  }
  requestAnimationFrame(tick);
};

canvas.addEventListener('mousedown', pressBrush);
addEventListener('mousemove', handleMouseMove);

tick();
