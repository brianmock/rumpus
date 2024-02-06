import { $, useOnDocument, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { BRICK_TYPES, type Brick, type BrickType, drawBricks, createBricks, isInBrick } from './Brick';
import { PADDLE_WIDTH, PADDLE_HEIGHT, usePaddle, drawPaddle } from './Paddle';
import { drawBall, generateBallPoints } from './Ball';

export const LEVELS: Record<number, Record<BrickType, number>> = {
  1: { easy: 3, medium: 3, hard: 2 },
  2: { easy: 1, medium: 1, hard: 1 },
  3: { easy: 1, medium: 0, hard: 2 },
}

export const POWER_UPS = {
  ball: ['super', 'rainbow', 'fast', 'slow'],
  paddle: ['wide', 'narrow'],
};

export function generateRandomDirection() {
  const initialDirection = Math.floor(Math.random() * 8);
  return Math.random() < 0.5 ? -initialDirection : initialDirection;
}

export default component$(() => {
  const augmentations = useSignal([]);
  const ballRadius = 10 * (augmentations.value.filter(el => el === 'super').length + 1);
  const level = useSignal(1);
  const levelComplete = useSignal(false);
  const levelFailed = useSignal(false);
  const dx = useSignal(generateRandomDirection());
  const dy = useSignal(-5);
  const x = useSignal(0)
  const y = useSignal(0)
  const score = useSignal(0);
  const lives = useSignal(3);
  const canvasRef = useSignal<HTMLCanvasElement>();
  const bricks = useSignal<Brick[][]>(createBricks(level.value));
  const { rightPressed, leftPressed } = usePaddle();
  const paddleX = useSignal(0);

  useOnDocument(
    'mousemove',
    $((event) => {
      const relativeX = event.clientX - (canvasRef.value?.offsetLeft || 0);
      if(relativeX > 0 && relativeX < (canvasRef.value?.width || 0)) {
        paddleX.value = relativeX - PADDLE_WIDTH / 2;
      }
    })
  );

  useVisibleTask$(() => {
    // Resize canvas to fit screen
    function onResize(entries) {
      for (const entry of entries) {
        if (entry.devicePixelContentBoxSize) {
          const width = entry.devicePixelContentBoxSize[0].inlineSize;
          const height = entry.devicePixelContentBoxSize[0].blockSize;
          const displayWidth = Math.round(width);
          const displayHeight = Math.round(height);
          canvasRef.value!.width = displayWidth;
          canvasRef.value!.height = displayHeight - (8 * 8);
        }
      }
    }

    if (canvasRef.value) {
      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(canvasRef.value!, {box: 'device-pixel-content-box'});
      const canvas = canvasRef.value;
      const ctx = canvas.getContext("2d");
      x.value = canvas.width / 2;
      y.value = canvas.height - 30;
      paddleX.value = (canvas.width- PADDLE_WIDTH)/2;

      function collisionDetection() {
        const ballPoints = generateBallPoints(x.value, y.value, ballRadius);
        bricks.value.forEach(row => row.forEach(b => {
          const { points = 0 } = BRICK_TYPES[b.type];
          Object.keys(ballPoints).forEach((side) => { 
            const coords = ballPoints[side as keyof typeof ballPoints];
            if(b.status == 1) {
              if (isInBrick({ brick: b, x: coords.x, y: coords.y })) {
                switch(side) {
                  case 'top':
                  case 'bottom':
                    dy.value = -dy.value;
                    break;
                  case 'left':
                  case 'right':
                    dx.value = -dx.value;
                    break;
                  default:
                    break;
                }
                b.status = 0;
                score.value += points;
                if(bricks.value.every(row => row.every(brick => brick.status === 0) )) {
                  levelComplete.value = true;
                }
              }
            }
          });
        }));
      }

      function draw() {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks(ctx!, bricks.value);
        drawBall({ augmentations: augmentations.value, ctx: ctx!, x: x.value, y: y.value, ballRadius });
        drawPaddle(ctx!, paddleX.value, canvas);
        collisionDetection();

        // Bounce off walls
        if(x.value + dx.value > canvas.width- ballRadius || x.value + dx.value < ballRadius) {
          dx.value = -dx.value;
        }
        // Bounce off ceiling
        if(y.value + dy.value < ballRadius) {
          dy.value = -dy.value;
        }
        // Bounce off paddle or lose life
        else if(y.value + PADDLE_HEIGHT + dy.value > canvas.height - ballRadius) {
          if(x.value > paddleX.value && x.value < paddleX.value + PADDLE_WIDTH) {
            dy.value = -dy.value;
            dx.value = 8 * ((x.value - (paddleX.value + PADDLE_WIDTH/2)) / PADDLE_WIDTH);
          }
          else {
            lives.value --;
            if(!lives.value) {
              levelFailed.value = true;
            }
            else {
              x.value = canvas.width/2;
              y.value  = canvas.height-30;
              dx.value = generateRandomDirection();
              dy.value = -5;
              paddleX.value = (canvas.width- PADDLE_WIDTH)/2;
            }
          }
        }

        if(rightPressed.value && paddleX.value < canvas.width-PADDLE_WIDTH) {
          paddleX.value += 7;
        }
        else if(leftPressed.value && paddleX.value > 0) {
          paddleX.value -= 7;
        }

        x.value += dx.value;
        y.value += dy.value;
        requestAnimationFrame(draw);
      }
      draw();
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {levelComplete.value && <button style={{ position: 'absolute' }} onClick$={() => {
        level.value += 1
        lives.value = 3
        bricks.value = createBricks(level.value)
        levelComplete.value = false
      }}>next level!</button>}
      {levelFailed.value && <button style={{ position: 'absolute' }} onClick$={() => {
        lives.value = 3
        bricks.value = createBricks(level.value)
        levelFailed.value = false
      }}>retry!</button>}
      <div>Level: {level.value}</div>
      <div>Lives: {lives.value}</div>
      <div>Score: {score.value}</div>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas ref={canvasRef} id="pinball" style={{ display: 'block', width: '100vw', height: 'calc(100vh - 8rem)' }} />
      </div>
    </div>
  );
})
