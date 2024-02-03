import { $, component$, useContext, useSignal, useStore, useComputed$, useVisibleTask$, useOnDocument, useStylesScoped$ } from '@builder.io/qwik'
import { Link, useNavigate } from '@builder.io/qwik-city';
import styles from "./styles.css?inline";

import { AvatarContext } from '../../routes/layout';

export default component$(() => {
  useStylesScoped$(styles);
  const nav = useNavigate();
  const pinballRect = useStore<{
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  }>({});
  const position = useContext(AvatarContext);
  const pinballRef = useSignal<Element>();

  // Necessary because DOMRect is not serializable
  useVisibleTask$(() => {
    const rect = pinballRef.value?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    pinballRect.bottom = rect.bottom;
    pinballRect.left = rect.left;
    pinballRect.right = rect.right;
    pinballRect.top = rect.top;
  });

  const insidePinball = useComputed$(() => {
    return pinballRect.bottom && pinballRect.left && pinballRect.right && pinballRect.top && position.x > pinballRect.left && position.x < pinballRect.right && position.y > pinballRect.top && position.y < pinballRect.bottom;
  });

  useOnDocument(
    'keyup',
    $((event) => {
      if (insidePinball.value && ['Enter'].includes(event.key)) {
        nav('/pinball');
      }
    })
  );

  const pinballAscii =
"           /\\" + "\n" +
"          <  \\" + "\n" +
"          |\\  \\" + "\n" +
"          | \\  \\" + "\n" +
"          | .\\  >" + "\n" +
"          |  .\\/|" + "\n" +
"          |   .||" + "\n" +
"          |    ||" + "\n" +
"         / \\   ||" + "\n" +
"        /,-.\\: ||" + "\n" +
"       /,,  `\\ ||" + "\n" +
"      /,  ', `\\||" + "\n" +
"     /, *   ''/ |" + "\n" +
"    /,    *,'/  |" + "\n" +
"   /,     , /   |" + "\n" +
"  / :    , /   .|" + "\n" +
" /\\ :   , /   /||" + "\n" +
"|\\ \\ .., /   / ||" + "\n" +
"|.\\ \\ . /   /  ||" + "\n" +
"|  \\ \\ /   /   ||" + "\n" +
"|   \\ /   /    |'" + "\n" +
"|\\o '|o  /" + "\n" +
"||\\o |  /" + "\n" +
"|| \\ | /" + "\n" +
"||  \\|/" + "\n" +
"|'   ||" + "\n" +
"     ||" + "\n" +
"     ||" + "\n" +
"     |\\'";

  return (
    <div style={{ width: '100%', height: '100%' }} ref={pinballRef}>
      <span style={{ color: 'black' }}>{insidePinball.value && 'Press enter!'}</span>
      <Link href="/pinball">
        <pre class="pinball">{pinballAscii}</pre>
      </Link>
    </div>
  );
})
