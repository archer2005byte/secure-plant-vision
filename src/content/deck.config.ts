/**
 * Per-deck configuration. When you copy this repo as a template, this file and
 * `deck.overrides.json` are usually the only two files you need to change.
 */
export const deckConfig = {
  /** GitHub repository name — also the GitHub Pages sub-path. */
  repoName: "secure-plant-vision",
  /** GitHub account or organisation that owns the repository. */
  owner: "archer2005byte",
};

export const publishedUrl = `https://${deckConfig.owner}.github.io/${deckConfig.repoName}/`;
export const basePath = `/${deckConfig.repoName}/`;
