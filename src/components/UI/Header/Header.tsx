import { Link } from 'react-router-dom';

import Offcanvas from '../Offcanvas';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <button
        className={`${styles.header__btn} ${styles.header__btn_left}`}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasScrolling"
        aria-controls="offcanvasScrolling"
      >
        <span className={`material-symbols-outlined ${styles.header__icon}`}>
          menu
        </span>
      </button>
      <Offcanvas />
      <div className={styles.header__titleContainer}>
        <Link to="/" className={styles.header__link}>
          <h1 className={styles.header__title}>Herman Frelikh Clothing</h1>
        </Link>
      </div>
      <nav className={styles.header__nav}>
        <Link
          to="/cart"
          className={`${styles.header__btn} ${styles.header__link}`}
        >
          <span className={`material-symbols-outlined ${styles.header__icon}`}>
            shopping_cart
          </span>
        </Link>
        <Link
          to="/profile"
          className={`${styles.header__btn} ${styles.header__link}`}
        >
          <span className={`material-symbols-outlined ${styles.header__icon}`}>
            person
          </span>
        </Link>
        <Link
          to="/login"
          className={`${styles.header__btn} ${styles.header__link}`}
        >
          <span className={`material-symbols-outlined ${styles.header__icon}`}>
            logout
          </span>
        </Link>
      </nav>
    </header>
  );
}
