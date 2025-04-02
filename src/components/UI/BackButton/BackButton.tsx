import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import styles from './BackButton.module.scss';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <ArrowBackIcon
      className={styles.button}
      fontSize="large"
      onClick={() => navigate(-1)}
    />
  );
}
