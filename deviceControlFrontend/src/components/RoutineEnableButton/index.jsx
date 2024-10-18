import { useContext } from "react";
import { CheckDisabledIcon, CheckEnabledIcon } from "../Icons";
import RoutineButton from "../RoutineButton";
import { socketContext } from "../Socket";
import { useDispatch } from "react-redux";
import { setRoutines } from "../Store/system.slice";

const RoutineEnableButton = ({ routineData }) => {


    const {emit} = useContext(socketContext)
    const dispatch = useDispatch()

    const handleOnChangeRoutineEnabling = () => { 
        emit({
            channel: routineData.enabled ? "disableRoutine" : "enableRoutine",
            value: {routineID: routineData._id},
            cb: () => {
                emit({
                    channel: 'getRoutines',
                    cb: (routines) => dispatch(setRoutines(routines))
                })
            }
        })
    }

    return (
        <RoutineButton
            onPress={handleOnChangeRoutineEnabling}>
            {
                routineData?.enabled 
                    ? <CheckEnabledIcon
                        color={"var(--cardBackground"} />
                    : <CheckDisabledIcon
                        color={"var(--cardBackground"} />
            }
        </RoutineButton>);
}

export default RoutineEnableButton;