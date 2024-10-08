import { useSelector } from "react-redux";
import "./routines.css";
import Routine from "../../components/Routine";

const RoutineView = () => {

    const { routines } = useSelector(state => state.system)

    return (
        <div className="routines">
            {
                routines.map(routine => (
                    <Routine 
                        key={routine._id}
                        routineData={routine} />
                ))
            }
        </div>);
}

export default RoutineView;