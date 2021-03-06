import {format, parseISO} from 'date-fns'
import fs from 'fs'
import matter from 'gray-matter'
import {serialize} from 'next-mdx-remote/serialize'
import path from 'path'
import * as shiki from 'shiki'
import visit from 'unist-util-visit'

const pagesDirectory = path.join(process.cwd(), 'content', 'pages')
const postsDirectory = path.join(process.cwd(), 'content', 'posts')

async function renderMarkdown(content) {
  const shikiTheme = await shiki.loadTheme(path.resolve('./src/code-theme.json'))
  const highlighter = await shiki.getHighlighter({theme: shikiTheme})

  return await serialize(content, {
    mdxOptions: {remarkPlugins: [[highlight, {highlighter}]]},
  })
}

function highlight({highlighter} = {}) {
  return (ast) => visit(ast, 'code', visitor)
  function visitor(node) {
    node.type = 'html'
    if (!node.lang) {
      node.value = `<pre class="shiki-unknown"><code>${node.value}</code></pre>`
    } else {
      node.value = highlighter.codeToHtml(node.value, node.lang)
    }
  }
}

export async function getPageBySlug(slug) {
  const fullPath = path.join(pagesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const {data, content} = matter(fileContents)
  const markdown = await renderMarkdown(content)
  return {slug, frontmatter: data, content: markdown, originalContent: content}
}

export async function getAllPages() {
  const filenames = fs.readdirSync(pagesDirectory)
  const slugs = filenames.map((filename) => filename.replace(/\.md$/, ''))
  const pages = await Promise.all(slugs.filter((slug) => slug !== 'index').map((slug) => getPageBySlug(slug)))
  return pages
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const {data, content} = matter(fileContents)
  const date = format(parseISO(data.date), 'MMMM dd, yyyy')
  const markdown = await renderMarkdown(content)
  return {slug, frontmatter: {...data, date, dateISO: data.date}, content: markdown, originalContent: content}
}

export async function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory)
  const slugs = filenames.map((filename) => filename.replace(/\.md$/, ''))
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  return posts.sort((a, b) => {
    if (a.frontmatter.dateISO > b.frontmatter.dateISO) return -1
    if (b.frontmatter.dateISO > a.frontmatter.dateISO) return 1
  })
}
