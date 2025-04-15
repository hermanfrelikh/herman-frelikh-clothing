import { Link, useNavigate } from 'react-router-dom';

import Offcanvas from '../Offcanvas';
import styles from './Header.module.scss';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
        <button
          onClick={handleLogout}
          className={`${styles.header__btn} ${styles.header__link}`}
        >
          <span className={`material-symbols-outlined ${styles.header__icon}`}>
            logout
          </span>
        </button>
      </nav>
    </header>
  );
}
