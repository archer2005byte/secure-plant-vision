import { createFileRoute } from "@tanstack/react-router";

import { DeckBody } from "@/components/site/DeckBody";
import { copy } from "@/content/sectionCopy";
import { publishedUrl } from "@/content/deck.config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: copy.meta.title },
      { name: "description", content: copy.meta.description },
      { property: "og:title", content: copy.meta.title },
      { property: "og:description", content: copy.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: publishedUrl },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: publishedUrl }],
  }),
  component: Index,
});

function Index() {
  return <DeckBody />;
}
