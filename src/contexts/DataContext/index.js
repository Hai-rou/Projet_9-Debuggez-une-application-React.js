import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getData = useCallback(async () => {
    try {
      const result = await api.loadData();

      // Ici on dérive la donnée une seule fois !
      const events = result.events || [];
      const last = events.length > 0 ? events[events.length - 1] : null;

      setData({
        ...result,
        last,  // On ajoute directement la propriété last dans le data fourni
      });
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]); // <-- pense bien à ajouter les dépendances

    // ✅ Optimisation useMemo ici :
  const contextValue = useMemo(() => ({ data, error }), [data, error]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);
export default DataContext;
