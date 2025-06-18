import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Trie les événements par date décroissante (plus récent d'abord)
  const byDateDesc = [...(data?.focus || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        setPaused(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  // 🔁 Lance un changement de slide toutes les 5 secondes
  useEffect(() => {
    let timer;

    if (!paused) {
      timer = setTimeout(() => {
        setIndex((prev) =>
          prev < byDateDesc.length - 1 ? prev + 1 : 0
        );
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [index, byDateDesc.length, paused]); 


  return (

    <div className="SlideCardList">
      
      {paused ? <div>En pause</div> : <div>Lecture</div>}

      {/* 🎞️ Slides : une seule slide visible à la fois */}
      {byDateDesc.map((event, idx) => (
        <div
          key={event.title}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt={event.title} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      {/* 🔘 Pagination : affichée UNE seule fois, synchronisée avec l’index */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={`pagination-${event.title}`} // ✅ une vraie clé unique pour eviter l'erreur key dans le navigateur 
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              readOnly
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Slider;
