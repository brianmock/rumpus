import { $, component$, useContext, useSignal, useStore, useComputed$, useVisibleTask$, useOnDocument, useStylesScoped$ } from '@builder.io/qwik'
import { Link, useNavigate } from '@builder.io/qwik-city';
import styles from "./styles.css?inline";

import { AvatarContext } from '../../routes/layout';
import { DESTINATIONS, type Destination } from '../../constants';

export default component$(({ destination }: { destination: Destination }) => {
  const { ascii, path } = DESTINATIONS[destination];

  useStylesScoped$(styles);
  const nav = useNavigate();
  const destinationRect = useStore<{
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  }>({});
  const position = useContext(AvatarContext);
  const destinationRef = useSignal<Element>();

  // Necessary because DOMRect is not serializable
  useVisibleTask$(() => {
    const rect = destinationRef.value?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    destinationRect.bottom = rect.bottom;
    destinationRect.left = rect.left;
    destinationRect.right = rect.right;
    destinationRect.top = rect.top;
  });

  const insideDestination = useComputed$(() => {
    return destinationRect.bottom && destinationRect.left && destinationRect.right && destinationRect.top && position.x > destinationRect.left && position.x < destinationRect.right && position.y > destinationRect.top && position.y < destinationRect.bottom;
  });

  useOnDocument(
    'keyup',
    $((event) => {
      if (insideDestination.value && ['Enter'].includes(event.key)) {
        nav(path);
      }
    })
  );

  return (
    <div style={{ width: '100%', height: '100%' }} ref={destinationRef}>
      <span style={{ color: 'black' }}>{insideDestination.value && 'Press enter!'}</span>
      <Link href={path}>
        <pre class="ascii">{ascii}</pre>
      </Link>
    </div>
  );
})
