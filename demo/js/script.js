const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

import Ball from 'ball';

let ball = new Ball(100, 50, 3, 5);

function draw() {
  ctx.beginPath();
  ctx.arc(50, 50, 10, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}