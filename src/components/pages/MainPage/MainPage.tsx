import MainCarousel from '../../UI/MainCarousel';
import YandexMap from '../../UI/YandexMap';

export default function MainPage() {
  return (
    <>
      <MainCarousel />
      <form className="d-flex" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        ></input>
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
      <YandexMap />
    </>
  );
}
