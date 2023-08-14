import pluginMdx from '@mdx-js/rollup';
import remarkPluginGFM from 'remark-gfm';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypePluginSlug from 'rehype-slug';

import { Plugin } from 'rollup';
import { rehypePluginShiki } from '../rehypePlugins/shiki';
import shiki from 'shiki';
import { rehypePluginPreWrapper } from '../rehypePlugins/preWrapper';
import { remarkPluginToc } from '../remarkPlugins/toc';

export async function pluginMdxRollup(): Promise<Plugin> {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginMDXFrontMatter,
      remarkPluginFrontmatter,
      remarkPluginToc
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
      ],
      rehypePluginPreWrapper,
      [
        rehypePluginShiki,
        {
          highlighter: await shiki.getHighlighter({ theme: 'nord' })
        }
      ]
    ]
  });
}
