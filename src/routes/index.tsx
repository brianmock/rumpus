import { component$, useStylesScoped$ } from '@builder.io/qwik'
import styles from "./styles.css?inline";
import type { DocumentHead } from "@builder.io/qwik-city";
import Pinball from "../components/pinball";

export default component$(() => {
  useStylesScoped$(styles);
  return (
    <>
      <div class="destination breakout">
        Breakout
      </div>
      <div class="destination bulletin">
        Wall of Brian
      </div>
      <div class="destination pinball">
        <Pinball />
      </div>
      <div class="destination snake">
        Snake
      </div>
    </>
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
