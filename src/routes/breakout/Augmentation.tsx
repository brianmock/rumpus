export function drawAugmentation({ ctx, x, y }) {
  const ballColor = augmentations.includes('rainbow') ? "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}) : "#70A0AF";

  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

export function generateBallPoints(x: number, y: number, ballRadius: number) {

  return {
    top: { x, y: y - ballRadius },
    right: { x: x + ballRadius, y },
    bottom: { x, y: y + ballRadius },
    left: { x: x - ballRadius, y },
  }
}
