import { component$, useStylesScoped$ } from '@builder.io/qwik'

import styles from "./styles.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <div class="board">
      <a target="_blank" href="https://www.mixit.today">
        <div class="page mixit">
          <div class="pushpin">
            <div class="pintop"/>
            <div class="pinmiddle"/>
            <div class="pinbottom"/>
            <div class="pinpoint"/>
          </div>
          <div class="mixit-color cyan"/>
          <div class="mixit-color magenta"/>
          <div class="mixit-color yellow"/>
          <div class="mixit-color black"/>
          <div class="mixit-label">Mixit</div>
        </div>
      </a>
    </div>
  );
})
