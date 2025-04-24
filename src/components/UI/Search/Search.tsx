import React, { useState } from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <form className="d-flex" role="search">
      <input
        className="form-control me-2"
        type="search"
        placeholder="Поиск"
        aria-label="Search"
        style={{ width: '300px' }}
        value={query}
        onChange={handleChange}
      />
      <button className="btn btn-outline-success" type="submit">
        Поиск
      </button>
    </form>
  );
}
