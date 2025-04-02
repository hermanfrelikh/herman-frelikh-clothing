import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import womanManImg from '../../../assets/woman-man.webp';
import { setCategories } from '../../../redux/slices/categoriesSlice';
import styles from './WomanMan.module.scss';

const WomanMan: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <span className={styles.text}>
          <Link
            to="/woman"
            className={styles.container__link}
            onClick={() => dispatch(setCategories('All'))}
          >
            Женское
          </Link>
        </span>
      </div>
      <div className={styles.right}>
        <span className={styles.text}>
          <Link
            to="/man"
            className={styles.container__link}
            onClick={() => dispatch(setCategories('All'))}
          >
            Мужское
          </Link>
        </span>
      </div>
      <img src={womanManImg} alt="Background" className={styles.image} />
    </div>
  );
};
export default WomanMan;
