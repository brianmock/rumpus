import { component$, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik'
import { AvatarContext } from '../../routes/layout';

export default component$(() => {
  const pinballRect = useStore<{
    bottom?: number;
    height?: number;
    left?: number;
    right?: number;
    top?: number;
    width?: number;
    x?: number;
    y?: number;
  }>({});
  const position = useContext(AvatarContext);
  const pinballRef = useSignal<Element>();
  const yoRef = useSignal<string>('');

  useVisibleTask$(() => {
    const rect = pinballRef.value?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    pinballRect.bottom = rect.bottom;
    pinballRect.height = rect.height;
    pinballRect.left = rect.left;
    pinballRect.right = rect.right;
    pinballRect.top = rect.top;
    pinballRect.width = rect.width;
    pinballRect.x = rect.x;
    pinballRect.y = rect.y;
  });

  // this seems... not great must be a better way
  useVisibleTask$(() => {
    const intervalId = setInterval(() => {
      if (pinballRect.x && pinballRect.y && pinballRect.width && pinballRect.height && pinballRect.bottom && pinballRect.left && pinballRect.right && pinballRect.top) {
        if (position.x > pinballRect.left && position.x < pinballRect.right && position.y > pinballRect.top && position.y < pinballRect.bottom) {
          console.log('inside pinball');
          yoRef.value = 'yo';
        }
      }
    }, 10);
    return () => clearInterval(intervalId);
  });

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
    <div ref={pinballRef}>
      {yoRef.value}
      <pre>{pinballAscii}</pre>
    </div>
  )
})
