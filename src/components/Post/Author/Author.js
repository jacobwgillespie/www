import React from 'react'
import {graphql, StaticQuery} from 'gatsby'
import styles from './Author.module.scss'

export const PureAuthor = ({data}) => {
  const {author} = data.site.siteMetadata

  return (
    <div className={styles['author']}>
      <p className={styles['author__bio']}>
        <span dangerouslySetInnerHTML={{__html: author.bio}} />
        <a
          className={styles['author__bio-twitter']}
          href="https://twitter.com/jacobwgillespie"
          rel="noopener noreferrer"
          target="_blank"
        >
          <strong>{author.name}</strong> on Twitter
        </a>
      </p>
    </div>
  )
}

export const Author = props => (
  <StaticQuery
    query={graphql`
      query AuthorQuery {
        site {
          siteMetadata {
            author {
              name
              bio
              contacts {
                twitter
              }
            }
          }
        }
      }
    `}
    render={data => <PureAuthor {...props} data={data} />}
  />
)

export default Author
