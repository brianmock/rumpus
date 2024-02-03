import { $, useOnDocument, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { BRICK_TYPES, type Brick, type BrickType, drawBricks, createBricks } from './Brick';
import { PADDLE_WIDTH, PADDLE_HEIGHT, usePaddle, drawPaddle } from './Paddle';
import { BALL_RADIUS, drawBall } from './Ball';

export const LEVELS: Record<number, Record<BrickType, number>> = {
  1: { easy: 3, medium: 0, hard: 0 },
  2: { easy: 1, medium: 1, hard: 1 },
  3: { easy: 1, medium: 0, hard: 2 },
}

export default component$(() => {
  const level = useSignal(1);
  const levelComplete = useSignal(false);
  const levelFailed = useSignal(false);
  const dx = useSignal(5);
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
    if (canvasRef.value) {
      const canvas = canvasRef.value;
      const ctx = canvas.getContext("2d");
      x.value = canvas.width / 2;
      y.value = canvas.height - 30;
      paddleX.value = (canvas.width- PADDLE_WIDTH)/2;

      function collisionDetection() {
        bricks.value.forEach(row => row.forEach(b => {
          const { width = 0, height = 0, points = 0 } = BRICK_TYPES[b.type];
          if(b.status == 1) {
            if(x.value > b.x && x.value < b.x + width && y.value > b.y && y.value < b.y + height) {
              dy.value = -dy.value;
              b.status = 0;
              score.value += points;
              if(bricks.value.every(row => row.every(brick => brick.status === 0) )) {
                levelComplete.value = true;
              }
            }
          }
        }));
      }

      function draw() {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks(ctx!, bricks.value);
        drawBall(ctx!, x.value, y.value);
        drawPaddle(ctx!, paddleX.value, canvas);
        collisionDetection();

        // Bounce off walls
        if(x.value + dx.value > canvas.width- BALL_RADIUS || x.value + dx.value < BALL_RADIUS) {
          dx.value = -dx.value;
        }
        // Bounce off ceiling
        if(y.value + dy.value < BALL_RADIUS) {
          dy.value = -dy.value;
        }
        // Bounce off paddle or lose life
        else if(y.value + PADDLE_HEIGHT + dy.value > canvas.height - BALL_RADIUS) {
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
              dx.value = 5;
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
      {levelComplete.value && <button onClick$={() => {
        level.value += 1
        lives.value = 3
        bricks.value = createBricks(level.value)
        levelComplete.value = false
      }}>next level!</button>}
      {levelFailed.value && <button onClick$={() => {
        lives.value = 3
        bricks.value = createBricks(level.value)
        levelFailed.value = false
      }}>retry!</button>}
      <div>Level: {level.value}</div>
      <div>Lives: {lives.value}</div>
      <div>Score: {score.value}</div>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas ref={canvasRef} id="pinball" height={640} width={960} />
      </div>
    </div>
  );
})
