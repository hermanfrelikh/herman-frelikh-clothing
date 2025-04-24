import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface СardProps {
  title: string;
  price: number;
  image: string | null;
  secondImage: string;
}

const Card: React.FC<СardProps> = ({ image, title, price, secondImage }) => {
  const [img, setImg] = useState<string | null>(image);
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/${title.toLocaleLowerCase().replace(/ /g, '_')}`)
      }
      className="card"
      style={{ width: '18rem', margin: '30px' }}
    >
      <img
        onMouseEnter={() => setImg(secondImage)}
        onMouseLeave={() => setImg(image)}
        src={img || ''}
        className="card-img-top"
        alt={title}
      ></img>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{price + '$'}</p>
      </div>
    </div>
  );
};

export default Card;
