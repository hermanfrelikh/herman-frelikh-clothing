export default function Search() {
  return (
    <form className="d-flex" role="search">
      <input
        className="form-control me-2"
        type="search"
        placeholder="Поиск"
        aria-label="Search"
        style={{ width: '300px' }}
      ></input>
      <button className="btn btn-outline-success" type="submit">
        Поиск
      </button>
    </form>
  );
}
