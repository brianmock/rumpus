export function drawFlippers(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, leftPressed: boolean, rightPressed: boolean) {
  const leftFlipperStart = { x: 100, y: canvas.height - 100 }; 
  const leftFlipperEnd = { x: 150, y: leftPressed ? canvas.height - 150 : canvas.height - 50 }; 

  const rightFlipperStart = { x: canvas.width - 100, y: canvas.height - 100 };
  const rightFlipperEnd = { x: canvas.width - 150, y: rightPressed ? canvas.height - 150 : canvas.height - 50 };

  ctx.beginPath();
  ctx.moveTo(leftFlipperStart.x, leftFlipperStart.y);
  ctx.lineTo(leftFlipperEnd.x, leftFlipperEnd.y);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(rightFlipperStart.x, rightFlipperStart.y);
  ctx.lineTo(rightFlipperEnd.x, rightFlipperEnd.y);
  ctx.stroke();
  ctx.closePath();
}
