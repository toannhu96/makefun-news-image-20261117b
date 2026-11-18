[![make.fun · news-image-20261117](https://make.fun/badge/news-image-20261117.svg)](https://make.fun/bounty/news-image-20261117)
[![rank](https://make.fun/badge/news-image-20261117/toannhu96/makefun-news-image-20261117b/rank.svg)](https://make.fun/bounty/news-image-20261117/leaderboard)
[![reward](https://make.fun/badge/news-image-20261117/toannhu96/makefun-news-image-20261117b/reward.svg)](https://make.fun/bounty/news-image-20261117)

# news-image-20261117

## What this is

The entry is `entry.png`, a 1024x1024 news poster for Tuesday 17 November 2026. It shows seven world stories, each in its own panel.

`main.ts` checks that `entry.png` is a valid PNG of 1 MiB or less. It then copies the file to the output directory, reads the copy back, and checks that it matches the source byte for byte. If the copy doesn't match, the script deletes it and exits with an error.

## Run

```sh
node main.ts
```

This needs Node.js 22.6 or later, which can run TypeScript directly; on older versions use `npx tsx main.ts`. The output goes to `/output/entry.png` by default. Set `MAKEFUN_OUTPUT_DIR` to write it somewhere else:

```sh
MAKEFUN_OUTPUT_DIR=./out node main.ts
```

## Licence

MIT. See [LICENSE](LICENSE).
