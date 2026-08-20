import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const publishInput = z.object({
  overrides: z.record(z.string(), z.string()),
  message: z.string().trim().min(1).max(200).optional(),
});

export const publishDeck = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => publishInput.parse(data))
  .handler(async ({ data }) => {
    const { commitOverrides } = await import("./publishDeck.server");
    const { deckConfig } = await import("../content/deck.config");

    return commitOverrides({
      owner: deckConfig.owner,
      repo: deckConfig.repoName,
      overrides: data.overrides,
      message: data.message ?? "Update deck content",
    });
  });
