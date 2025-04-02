import { Link } from 'react-router-dom';

export default function Offcanvas() {
  return (
    <div
      className="offcanvas offcanvas-start"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      tabIndex="-1"
      id="offcanvasScrolling"
      aria-labelledby="offcanvasScrollingLabel"
      style={{ width: '25%' }}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
          Меню
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <p>
          <Link to="/favorites">Избранные</Link>
        </p>
        <p>
          <Link to="/cart">Корзина</Link>
        </p>
        <p>
          <Link to="/profile">Профиль</Link>
        </p>
      </div>
    </div>
  );
}
