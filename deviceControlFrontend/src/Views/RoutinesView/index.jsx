import { useSelector } from "react-redux";
import "./routines.css";
import Routine from "../../components/Routine";

const RoutineView = () => {
  const { routines, SERVER_URL, SERVER_PORT } = useSelector(
    (state) => state.system
  );

  const handleOnKeyDown = (e) => {
    if (e.keyCode === 123) fetch(`${SERVER_URL}:${SERVER_PORT}/devmode`);
  };

  return (
    <div className="routinesContainer">
      <div tabIndex={0} onKeyDown={handleOnKeyDown} className="routines">
        {routines.map((routine) => (
          <Routine key={routine._id} routineData={routine} />
        ))}
      </div>
    </div>
  );
};

export default RoutineView;
