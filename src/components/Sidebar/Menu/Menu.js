import React from 'react'
import {Link} from 'gatsby'
import styles from './Menu.module.scss'

const Menu = ({menu}) => (
  <nav className={styles['menu']}>
    <ul className={styles['menu__list']}>
      {menu.map(item => (
        <li className={styles['menu__list-item']} key={item.path || item.url}>
          {item.path ? (
            <Link
              to={item.path}
              className={styles['menu__list-item-link']}
              activeClassName={styles['menu__list-item-link--active']}
            >
              {item.label}
            </Link>
          ) : null}

          {item.url ? (
            <a href={item.url} className={styles['menu__list-item-link']}>
              {item.label}
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  </nav>
)

export default Menu