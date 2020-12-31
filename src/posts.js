import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import {parseISO, format} from 'date-fns'
import remark from 'remark'
import html from 'remark-html'

const pagesDirectory = path.join(process.cwd(), 'content', 'pages')
const postsDirectory = path.join(process.cwd(), 'content', 'posts')

export async function getPageBySlug(slug) {
  const fullPath = path.join(pagesDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const {data, content} = matter(fileContents)
  const markdown = await remark()
    .use(html)
    .process(content || '')
  const renderedContent = markdown.toString()
  return {slug, frontmatter: data, content: renderedContent}
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, slug, 'index.md')
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const {data, content} = matter(fileContents)
  const date = format(parseISO(data.date), 'MMMM dd, yyyy')
  const markdown = await remark()
    .use(html)
    .process(content || '')
  const renderedContent = markdown.toString()
  return {slug, frontmatter: {...data, date, dateISO: data.date}, content: renderedContent}
}

export async function getAllPosts() {
  const slugs = fs.readdirSync(postsDirectory)
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  return posts.sort((a, b) => {
    if (a.frontmatter.dateISO > b.frontmatter.dateISO) return -1
    if (b.frontmatter.dateISO > a.frontmatter.dateISO) return 1
  })
}
