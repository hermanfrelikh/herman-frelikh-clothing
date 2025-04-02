import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4>Контактная информация</h4>
            <p>
              <strong>Адрес:</strong> Малая Пироговская ул., 8, Москва
            </p>
            <p>
              <strong>Телефон:</strong> +7 (904) 414-70-36
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:info@example.com">germanfrelikh12@gmail.com</a>
            </p>
          </div>
          <div className="col-md-4">
            <h4>Социальные сети</h4>
            <ul className="list-unstyled">
              <li>
                <a href="https://t.me/prodbyagny">Telegram</a>
              </li>
              <li>
                <a href="https://instagram.com/prodbyagny">Instagram</a>
              </li>
              <li>
                <a href="https://vk.com/prodbyagny">VK</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Часы работы</h4>
            <p>Пн-Пт: 9:00 - 18:00</p>
            <p>Сб-Вс: 10:00 - 16:00</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <p>&copy; 2025 Herman Frelikh Clothing. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
