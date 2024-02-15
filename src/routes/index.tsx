import { component$, useStylesScoped$ } from '@builder.io/qwik'
import styles from "./styles.css?inline";
import type { DocumentHead } from "@builder.io/qwik-city";

import Destination from "../components/destination";


export default component$(() => {

  useStylesScoped$(styles);

  return (
    <div class="main">
      <div class="destination breakout">
        <Destination destination="breakout" />
      </div>
      <div class="destination bulletin">
        <Destination destination="bulletin" />
      </div>
      <div class="destination pinball">
        <Destination destination="pinball" />
      </div>
      <div class="destination snake">
        Snake
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Rumpus",
  meta: [
    {
      name: "description",
      content: "Rumpus is my playground for Qwik and showcasing my work",
    },
  ],
};
