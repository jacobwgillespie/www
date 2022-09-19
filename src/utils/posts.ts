import type {MarkdownInstance} from 'astro'
import {format, parseISO} from 'date-fns'

export interface Frontmatter {
  title: string
  description: string
  date: string
  dateISO: string
  friendlyDate: string
}

interface MarkdownInstanceWithSlug<Frontmatter extends Record<string, any>> extends MarkdownInstance<Frontmatter> {
  slug: string
}

export function hydratePosts(
  posts: MarkdownInstance<Omit<Frontmatter, 'dateISO' | 'friendlyDate'>>[],
): MarkdownInstanceWithSlug<Frontmatter>[] {
  return posts
    .map((post) => hydratePost(post))
    .sort((a, b) => {
      if (a.frontmatter.dateISO > b.frontmatter.dateISO) return -1
      if (b.frontmatter.dateISO > a.frontmatter.dateISO) return 1
      return 0
    })
}

export function hydratePost(
  post: MarkdownInstance<Omit<Frontmatter, 'dateISO' | 'friendlyDate'>>,
): MarkdownInstanceWithSlug<Frontmatter> {
  const slug = post.file.replace(/\.md$/, '').replace(/^.*\//, '')

  const friendlyDate = format(parseISO(post.frontmatter.date), 'dd MMMM yyyy')
  const dateISO = post.frontmatter.date

  return {...post, frontmatter: {...post.frontmatter, dateISO, friendlyDate}, slug}
}
