// // @ts-check
// import { defineConfig } from 'astro/config';
// import mdx from '@astrojs/mdx';
// import sitemap from '@astrojs/sitemap';
// import tailwindcss from "@tailwindcss/vite";



// import vercel from '@astrojs/vercel';

// // https://astro.build/config
// export default defineConfig({
//   site: 'https://qifess.com',
//   integrations: [mdx(), sitemap()], 
//   adapter: vercel(),
//   vite: {
//     plugins: [tailwindcss()],
//   },

  
  
  
// });


import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import staticAdapter from '@astrojs/static';

export default defineConfig({
  site: 'https://qifess.com',
  integrations: [mdx(), sitemap()],
  adapter: staticAdapter(),
  vite: { plugins: [tailwindcss()] },
});
