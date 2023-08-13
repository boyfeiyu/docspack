import pluginMdx from '@mdx-js/rollup';
import remarkPluginGFM from 'remark-gfm';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';

import { Plugin } from 'rollup';

export function pluginMdxRollup(): Plugin {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginMDXFrontMatter,
      remarkPluginFrontmatter
    ],
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ]
    ]
  });
}
