import { $, component$, useSignal, useOnDocument, useStore, useStylesScoped$, useVisibleTask$, useContext } from '@builder.io/qwik'
import { type Position, AvatarContext } from '../../routes/layout';
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
  confused: '¯\\(°_o)/¯',
  cry: '(ಥ﹏ಥ)',
  angry: '(ง ͠° ͟ل͜ ͡°)ง',
  shocked: 'ლ(ಠ_ಠლ)',
  dead: '✖‿✖',
  love: '(♥_♥)',
  kiss: '(づ￣ ³￣)づ',
  angel: '☜(⌒▽⌒)☞',
  dance: '┌(ㆆ㉨ㆆ)ʃ',
  crab: '(\\|) ._. (|/)',
  robot: '{•̃_•̃}',
};

type Direction = { x: -1 | 0 | 1; y: -1 | 0 | 1};

export function updatePosition(position: Position, direction: Direction) {
  // Move right until the edge of the screen
  if (direction.x > 0 && position.x < window.innerWidth - 70) {
    position.x += 3;
  }
  // Move left until the edge of the screen
  if (direction.x < 0 && position.x > 0) {
    position.x -= 3;
  }
  // Move up until the edge of the screen
  if (direction.y < 0 && position.y < window.innerHeight - 70) {
    position.y += 3;
  }
  // Move down until the edge of the screen
  if (direction.y > 0 && position.y > 0) {
    position.y -= 3;
  }
}

export default component$(() => {
  useStylesScoped$(styles);
  const showOptions = useSignal(false);
  const position = useContext(AvatarContext);
  const selectedAvatar = useSignal('wink');
  const legs = useSignal('/\\');
  const direction = useStore<Direction>({ x: 0, y: 0 });

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
      if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        direction.x = 0;
      }
      if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
        direction.y = 0;
      }
    })
  );

  // Move avatar
  useVisibleTask$(() => {
    const intervalId = setInterval(() => {
      updatePosition(position, direction)
    }, 10);
    return () => clearInterval(intervalId);
  });

  // Animate legs
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
      <div style={{ top: position.y, left: position.x }} class="avatar" onClick$={() => showOptions.value = !showOptions.value}>
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
