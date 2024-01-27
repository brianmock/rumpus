import { $, component$, useSignal, useOnDocument, useStore, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik'
import styles from "./avatar.css?inline";

export const AVATARS: Record<string, string> = {
  sob: '(╥_╥)',
  happy: '(◕‿◕)',
  cool: '(⌐■_■)',
  meh: '(•_•)',
  wink: '(^_~)',
  smile: '(•‿•)',
  tongue: '(͡° ͜ʖ ͡°)',
  smirk: '(¬‿¬)',
  skeptical: '(ಠ_ಠ)',
  confused: '¯\(°_o)/¯',
  cry: '(ಥ﹏ಥ)',
  angry: '(ง ͠° ͟ل͜ ͡°)ง',
  shocked: 'ლ(ಠ_ಠლ)',
  dead: '✖‿✖',
  love: '(♥_♥)',
  kiss: '(づ￣ ³￣)づ',
  angel: '☜(⌒▽⌒)☞',
  dance: '┌(ㆆ㉨ㆆ)ʃ',
  crab: '(\|) ._. (|/)',
  robot: '{•̃_•̃}',
};

type Position = { x: number; y: number };
type Direction = { x: -1 | 0 | 1; y: -1 | 0 | 1};

export function updatePosition(position: Position, direction: Direction) {
  if (direction.x > 0 && position.x < window.innerWidth - 70) {
    position.x += 3;
  }
  if (direction.x < 0 && position.x > 0) {
    position.x -= 3;
  }
  if (direction.y > 0 && position.y > 0) {
    position.y -= 3;
  }
  if (direction.y < 0 && position.y < window.innerHeight - 70) {
    position.y += 3;
  }
}

export default component$(() => {
  useStylesScoped$(styles);
  const showOptions = useSignal(false);
  const selectedAvatar = useSignal('sob');
  const legs = useSignal('/\\');
  const direction = useStore<Direction>({ x: 0, y: 0 });
  const pos = useStore<Position>({ x: 0, y: 0 });

  useOnDocument(
    'keydown',
    $((event) => {
      if (event.key === 'ArrowLeft') {
        direction.x = -1;
      }
      if (event.key === 'ArrowRight') {
        direction.x = 1;
      }
      if (event.key === 'ArrowUp') {
        direction.y = 1;
      }
      if (event.key === 'ArrowDown') {
        direction.y = -1;
      }
    })
  );

  useOnDocument(
    'keyup',
    $((event) => {
      if (event.key === 'ArrowLeft') {
        direction.x += 1;
      }
      if (event.key === 'ArrowRight') {
        direction.x -= 1;
      }
      if (event.key === 'ArrowUp') {
        direction.y -= 1;
      }
      if (event.key === 'ArrowDown') {
        direction.y += 1;
      }
    })
  );

  useVisibleTask$(() => {
    const intervalId = setInterval(() => {
      updatePosition(pos, direction)
    }, 10);
    return () => clearInterval(intervalId);
  });

  useVisibleTask$(() => {
    const intervalId = setInterval(() => {
      if (direction.x !== 0 || direction.y !== 0) {
        legs.value = legs.value === '/\\' ? '||' : '/\\';
      }
    }, 250);
    return () => clearInterval(intervalId);
  });

  return (
    <>
      <div style={{ top: pos.y, left: pos.x }} class="avatar" onClick$={() => showOptions.value = !showOptions.value}>
        <div class="head">{AVATARS[selectedAvatar.value]}</div>
        <div class="legs" style={{ marginTop: 1, textAlign: 'center' }}>
          {legs.value}
        </div>
      </div>
      {showOptions.value && (
        <div class="optionsContainer">
          {Object.keys(AVATARS).map((avatar) => (
            <button
              class={{
                selected: selectedAvatar.value === avatar,
                avatarOption: true,
              }}
              key={avatar}
              onClick$={() => {
              selectedAvatar.value = avatar
              showOptions.value = false
            }}>
              {AVATARS[avatar]}
            </button>
          ))}
        </div>
      )}
    </>
  );
});
