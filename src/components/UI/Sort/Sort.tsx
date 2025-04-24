import React from 'react';

interface SortProps {
  onSortChange: (sortType: string) => void; // Функция для обработки выбора сортировки
}

export default function Sort({ onSortChange }: SortProps) {
  const handleSortChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Предотвращаем стандартное поведение ссылки
    const sortType = e.currentTarget.dataset.sort as string;
    onSortChange(sortType);
  };

  return (
    <div className="dropdown" style={{ marginTop: '20px' }}>
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Сортировать
      </button>
      <ul className="dropdown-menu">
        <li>
          <a
            className="dropdown-item"
            href="#"
            data-sort="name-asc"
            onClick={handleSortChange}
          >
            Имя (А-Я)
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            data-sort="name-desc"
            onClick={handleSortChange}
          >
            Имя (Я-А)
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            data-sort="price-asc"
            onClick={handleSortChange}
          >
            Цена (возрастание)
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            data-sort="price-desc"
            onClick={handleSortChange}
          >
            Цена (убывание)
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            data-sort="rating-asc"
            onClick={handleSortChange}
          >
            Рейтинг (возрастание)
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            data-sort="rating-desc"
            onClick={handleSortChange}
          >
            Рейтинг (убывание)
          </a>
        </li>
      </ul>
    </div>
  );
}
