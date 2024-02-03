import { $, useOnDocument, useSignal } from '@builder.io/qwik';

export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 10;

export function usePaddle() {
  const rightPressed = useSignal(false);
  const leftPressed = useSignal(false);
  useOnDocument(
    'keydown',
    $((event) => {
      const { code } = event;
      if (code === 'ArrowRight') {
        rightPressed.value = true;
      } else if (code === 'ArrowLeft') {
        leftPressed.value = true;
      }
    })
  );
  useOnDocument(
    'keyup',
    $((event) => {
      const { code } = event;
      if (code === 'ArrowRight') {
        rightPressed.value = false;
      } else if (code === 'ArrowLeft') {
        leftPressed.value = false;
      }
    })
  );
  return { rightPressed, leftPressed };
}

export function drawPaddle(ctx: CanvasRenderingContext2D, paddleX: number, canvas: HTMLCanvasElement) {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
