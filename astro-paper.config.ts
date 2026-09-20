import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://yanko-7.github.io/",
    title: "Yanko",
    description:
      "Yongkang Qi — geometry, generative models, and the systems that make them work. Research and engineering notes.",
    author: "Yongkang Qi",
    profile: "https://github.com/Yanko-7",
    ogImage: "og.png",
    lang: "en",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: { perPage: 6, perIndex: 4 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/Yanko-7" },
    { name: "mail", url: "mailto:yanko_77@outlook.com" },
  ],
  shareLinks: [],
});
