import { useState } from "react";
import { parseEventDate } from "../../helpers/Date";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredByType = !type
    ? data?.events || []
    : data?.events.filter((evt) => evt.type === type);

  const filteredEvents = filteredByType.filter(
    (_, index) =>
      index >= (currentPage - 1) * PER_PAGE &&
      index < currentPage * PER_PAGE
  );

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const pageNumber = Math.floor((filteredByType?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((evt) => evt.type));

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">

            {/* On parcourt tous les événements filtrés pour les afficher */}
            {filteredEvents.map((evt) => {
              
              // On parse la date de l'événement pour la convertir en objet Date JS (grâce au helper)
              const dateObj = parseEventDate(evt.date);

              // Pour chaque événement, on retourne un bloc Modal + EventCard
              return (
                // Composant Modal qui entoure chaque EventCard (affiche la popup au clic)
                <Modal 
                  key={evt.id} // clé unique pour React (toujours obligatoire dans un .map)
                  Content={
                    // Contenu affiché dans la modal quand elle est ouverte
                    <ModalEvent event={evt} />
                  }
                >

                  {/* Fonction enfant du Modal (pattern "render props") */}
                  {({ setIsOpened }) => (
                    // Composant EventCard qui affiche la miniature de l'événement
                    <EventCard
                      onClick={() => setIsOpened(true)} // Ouvre la modal au clic sur la carte
                      imageSrc={evt.cover} // Image de l'événement
                      title={evt.title}    // Titre de l'événement
                      date={dateObj}       // Date de l'événement (déjà parsée juste avant)
                      label={evt.type}     // Type d'événement (conférence, soirée, etc.)
                    />
                  )}
                </Modal>
              );
            })}
          </div>


          <div className="Pagination">
            {[...Array(pageNumber)].map((_, n) => (
              <a key={`page-${n + 1}`} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
