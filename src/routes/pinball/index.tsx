import { $, component$, useOnDocument, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik'

import { drawFlippers } from './Flippers';

// Flipper -- changes direction of ball
// Slingshots -- triangle shaped traps
// Bumpers -- circle shaped traps
// Targets -- square shaped traps
// Gobble hole -- eats ball and ends game
// Spinner -- rotates and changes direction of ball
// Teleporter -- teleports ball to another location
// Timer -- adds time to game
// Multiplier -- multiplies score
// Extra life -- adds life
// Multiball -- adds ball(s)

interface Game {
  leftFlipperPressed: boolean;
  rightFlipperPressed: boolean;
}

export function render(canvasRef: { value: HTMLCanvasElement | undefined }, game: Game) {
  if (!canvasRef.value) return;

  const ctx = canvasRef.value.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    drawFlippers(ctx, canvasRef.value, game.leftFlipperPressed, game.rightFlipperPressed);
  }
}

export default component$(() => {
  const game = useStore<Game>({
    leftFlipperPressed: false,
    rightFlipperPressed: false,
  });
  const score = useSignal(0);
  const lives = useSignal(3);
  const canvasRef = useSignal<HTMLCanvasElement>();

  useOnDocument(
    'keydown',
    $((event) => {
      const { code } = event;
      if (code === 'ShiftLeft') {
        game.leftFlipperPressed = true;
      }
      if (code === 'ShiftRight') {
        game.rightFlipperPressed = true;
      }
    })
  );

  useOnDocument(
    'keyup',
    $((event) => {
      const { code } = event;
      if (code === 'ShiftLeft') {
        game.leftFlipperPressed = false;
      }
      if (code === 'ShiftRight') {
        game.rightFlipperPressed = false;
      }
    })
  );

  useVisibleTask$(({ cleanup }: { cleanup: Function }) => {
    const intervalId = setInterval(() => {
      render(canvasRef, game);
    }, 10);
    cleanup(() => clearInterval(intervalId));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>Lives: {lives.value}</div>
      <div>Score: {score.value}</div>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas ref={canvasRef} id="pinball" height={640} width={960} />
      </div>
    </div>
  );
})
