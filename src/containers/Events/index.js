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
            {filteredEvents.map((evt) => {
              const dateObj = parseEventDate(evt.date);

              return (
                <Modal key={evt.id} Content={
                  <ModalEvent event={evt} />
                }>
                  {({ setIsOpened }) => (
                    <EventCard
                      onClick={() => setIsOpened(true)}
                      imageSrc={evt.cover}
                      title={evt.title}
                      date={dateObj}
                      label={evt.type}
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
