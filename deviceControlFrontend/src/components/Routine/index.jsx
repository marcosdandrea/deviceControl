import "./routine.css"
import { useEffect, useState } from "react";
import RoutineStatusIndicator, { RoutineStates } from "../RoutineStatusIndicator";
import Text, { fontFamilies } from "../Text";
import RoutineButtonsContainer from "../RoutineButtonsContainer";

const Routine = ({ routineData }) => {
    const [routineState, setRoutineState] = useState(RoutineStates.unknown)
    const [statusDescription, setStatusDescription] = useState("")

    const setRoutineStatus = () => {
        if (routineData.failed) {
            setRoutineState(RoutineStates.failed)
            setStatusDescription("Falló")
        } else if (routineData.finished) {
            setRoutineState(RoutineStates.fullfiled)
            setStatusDescription("Completada sin errores")
        } else if (routineData.running) {
            setRoutineState(RoutineStates.working)
            setStatusDescription("Trabajando...")
        } else if (routineData.armed) {
            setRoutineState(RoutineStates.armed)
            setStatusDescription("Lista")
        }
    }

    useEffect(() => {
        setRoutineStatus()
    }, [routineData])

    return (
        <div className={routineData.enabled ? "routine" : "routine disabled"}>
            <div className="routineBody">
            <RoutineStatusIndicator state={routineState} routineEnabled={routineData.enabled}/>
            <div className="titles">
                <Text
                    family={fontFamilies.medium}
                    size={17}
                    color={routineData.enabled ? "var(--textColor)" : "var(--disabled)"}
                    style={{ textTransform: "uppercase" }}>
                    {routineData.name}
                </Text>
                <Text
                    family={fontFamilies.italic}
                    color={routineData.enabled ? "var(--textColor)" : "var(--disabled)"}
                    size={12}>
                    {routineData.description}
                </Text>
                <Text
                    family={fontFamilies.regular}
                    color={"var(--disabled)"}
                    size={12}>
                    {`Estado: ${routineData.enabled ? statusDescription : "Deshabilitada"}`}
                </Text>
            </div>
            <RoutineButtonsContainer
                routineData={routineData}
            />
            </div>
        </div>);
}

export default Routine;