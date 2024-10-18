
import { useSelector } from "react-redux";
import { LogIcon, PlayIcon } from "../Icons";
import RoutineButton from "../RoutineButton";
import "./routineButtonsContainer.css"
import { useContext, useEffect, useState } from "react";
import { viewContext, VIEWS } from "../../Contexts/ViewContextProvider";
import RoutineEnableButton from "../RoutineEnableButton";

const RoutineButtonsContainer = ({ routineData }) => {

    const { SERVER_URL, SERVER_PORT } = useSelector(state => state.system)
    const { setCurrentView, setSelectedRoutineID } = useContext(viewContext)
    const [apiButton, setApiButton] = useState(null)

    const handleOnClickOnAPIButton = () => {
        fetch(`${SERVER_URL}:${SERVER_PORT}${apiButton.endpoint}`)
    }

    const handleOnViewRoutineLogs = () => {
        setSelectedRoutineID(routineData._id)
        setCurrentView(VIEWS.logs)
    }

    const setAPIButtons = () => {
        if (routineData.triggers.length > 0) {
            setApiButton(routineData.triggers.find(trigger => trigger.name == "API"))
        } else {
            setApiButton(null)
        }
    }

    useEffect(() => {
        setAPIButtons()
    }, [routineData])

    return (<div className="buttons">
        <RoutineEnableButton routineData={routineData}/>
        <RoutineButton
            onPress={handleOnViewRoutineLogs}>
            <LogIcon
                color={"var(--cardBackground"} />
        </RoutineButton>
        {
            apiButton ?
                <RoutineButton
                    disable={routineData.running || !routineData.enabled}
                    onPress={handleOnClickOnAPIButton}
                    color={"var(--fullfiled"}>
                    <PlayIcon
                        color={"var(--cardBackground"} />
                </RoutineButton>
                : <></>
        }
    </div>);
}

export default RoutineButtonsContainer;