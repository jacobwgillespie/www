import React from 'react'
import Helmet from 'react-helmet'
import styles from './Layout.module.scss'

import 'typeface-source-code-pro'

const Layout = ({children, title, description}) => (
  <div className={styles.layout}>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </div>
)

export default Layout
