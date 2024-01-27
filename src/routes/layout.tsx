import { useSignal, component$, type Signal, Slot, useStyles$ } from "@builder.io/qwik";
import { useContextProvider, createContextId } from '@builder.io/qwik';
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";

import Header from "../components/starter/header/header";
import Footer from "../components/starter/footer/footer";
import Avatar from "../components/avatar";

import styles from "./styles.css?inline";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const AvatarContext = createContextId<Signal<string>>('wink');

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  const avatar = useSignal('sob');
  useContextProvider(AvatarContext, avatar);
  useStyles$(styles);

  return (
    <>
      <Header />
      <main>
        <Avatar />
        <Slot />
      </main>
      <Footer />
    </>
  );
});
