import carouselItem1 from '../../../assets/carousel-item-1.webp';
import carouselItem2 from '../../../assets/carousel-item-2.webp';
import carouselItem3 from '../../../assets/carousel-item-3.webp';
import styles from './MainCarousel.module.scss';

const carouselItems = [
  {
    id: 1,
    img: carouselItem1,
  },
  {
    id: 2,
    img: carouselItem2,
  },
  {
    id: 3,
    img: carouselItem3,
  },
];

export default function MainCarousel() {
  return (
    <div id="carouselExampleIndicators" className="carousel slide">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div className="carousel-inner">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
          >
            <img
              src={item.img}
              className={`d-block w-100 ${styles.img}`}
              alt={`carousel item ${item.id}`}
            ></img>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
