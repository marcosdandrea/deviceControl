import "./logViews.css"
import { useContext, useEffect, useState } from "react";
import { viewContext, VIEWS } from "../../Contexts/ViewContextProvider";
import SectionHeader from "../../components/SectionHeader";
import RoutineButton from "../../components/RoutineButton";
import { BackIcon, CheckEnabledIcon, DeleteIcon, RefreshIcon } from "../../components/Icons";
import Text, { fontFamilies } from "../../components/Text";
import { useSelector } from "react-redux";
import Drawer, { DrawerChild, DrawerFather } from "../../components/Drawer";
import { toast } from "react-toastify";
import StandarButton from "../../components/StandarButton";
import ScreenMessage from "../../components/ScreenMessage";
import ShowSystemLogButton from "../../components/ShowSystemLogButton";

const LogsView = () => {
    const { SERVER_URL, SERVER_PORT } = useSelector(state => state.system)
    const { selectedRoutineID, setCurrentView } = useContext(viewContext)
    const { routines } = useSelector(state => state.system)
    const [routine, setRoutine] = useState({})
    const [routineLogs, setRoutineLogs] = useState({})
    const [showSystemLogs, setShowSystemLogs] = useState(true)
    const [filteredLogs, setFilteredLogs] = useState({})

    useEffect(()=>{
        const filtered = {}
        Object.keys(routineLogs).forEach(date => {
            if (!filtered?.[date])
                filtered[date] = []

            routineLogs[date].forEach(log => {
                if (showSystemLogs || log.routine!== "system")
                    filtered[date].push(log)
            })
        })
        setFilteredLogs (filtered)
    }, [showSystemLogs, routineLogs])

    const handleOnGoBack = () => {
        setCurrentView(VIEWS.routines)
    }

    const getRutineLogs = async () => {
        try {
            const answer = await fetch(`${SERVER_URL}:${SERVER_PORT}/routine/logs/${selectedRoutineID}`)
            const allLogs = await answer.json()
            setRoutineLogs(allLogs)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (selectedRoutineID) {
            setRoutine(routines.find(routine => routine._id === selectedRoutineID))
            getRutineLogs()
        } else {
            setRoutine({})
        }
    }, [])

    const reloadLogs = () => {
        getRutineLogs()
    }

    const handleOnDeleteLogEntry = (e, logDate) => {
        e.stopPropagation()

        const deleteEntry = async () => {
            toast.dismiss("confirm")
            try {
                await fetch(`${SERVER_URL}:${SERVER_PORT}/log/${selectedRoutineID}/${logDate}`, { method: "DELETE" })
                reloadLogs()
            } catch (e) {
                console.error(e)
            }
        }

        const abort = () => {
            toast.dismiss("confirm")
        }

        toast(
            <div style={{ display: "flex", flexDirection: "column" }}>
                <Text family={fontFamilies.bold}>Atención</Text>
                <Text>Esta acción no se podrá deshacer, ¿desea realmente eliminar la entrada de log?</Text>
                <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%", margin: "0.5rem", columnGap: "1rem" }}>
                    <StandarButton
                        onPress={deleteEntry}
                        style={{ backgroundColor: "var(--error)" }}
                        label={"Eliminar"} />
                    <StandarButton
                        label={"Cancelar"}
                        onPress={abort}
                    />
                </div>
            </div>,
            {
                toastId: "confirm",
                type: 'warning',
            })

    }

    const convertTimeToDate = (time) => {
        const date = new Date(Number(time))
        return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear()).padStart(2, "0")}`
    }

    const convertTimeToHours = (time) => {
        const date = new Date(Number(time))
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}.${String(date.getMilliseconds()).padStart(3, "0")}`
    }

    return (
        <div className="logViews">
            <SectionHeader>
                <div className="content">
                    <div className="titles">
                        <RoutineButton
                            onPress={handleOnGoBack}>
                            <BackIcon
                                color={"var(--cardBackground)"} />
                        </RoutineButton>
                        <Text
                            family={fontFamilies.bold}
                            size={16}
                            color={"var(--cardBackground)"}
                            style={{ textTransform: 'uppercase' }}>
                            {routine.name}
                        </Text>
                        <Text
                            family={fontFamilies.light}
                            size={12}
                            color={"var(--cardBackground)"}
                            style={{ textTransform: 'uppercase', display: "flex", alignItems: "center" }}>
                            ▸ Logs
                        </Text>
                    </div>
                    <ShowSystemLogButton setShowSystemLogs={setShowSystemLogs} showSystemLogs={showSystemLogs}/>
                    <div>
                        <RoutineButton
                            onPress={reloadLogs}>
                            <RefreshIcon
                                color={"var(--cardBackground)"} />
                        </RoutineButton>
                    </div>
                </div>

            </SectionHeader>
            <div className="logsContainer">
                <Drawer>
                    {
                        Object.keys(filteredLogs).length > 0 ?
                            Object.keys(filteredLogs).map(logDate =>
                                <DrawerFather
                                    key={logDate}
                                    id={logDate}
                                    title={convertTimeToDate(logDate)}
                                    buttons={
                                        <div>
                                            <RoutineButton
                                                onPress={(e) => handleOnDeleteLogEntry(e, logDate)}
                                                color={"var(--error)"}>
                                                <div style={{
                                                    padding: "0.2rem",
                                                    boxSizing: "border-box"
                                                }}>
                                                    <DeleteIcon
                                                        size={18}
                                                        color={"var(--cardBackground)"} />
                                                </div>
                                            </RoutineButton>
                                        </div>}>
                                    {
                                        filteredLogs[logDate].map((log, index) =>
                                            <DrawerChild
                                                key={index}
                                                style={{
                                                    backgroundColor:
                                                        log.level == 2
                                                            ? "var(--warning)"
                                                            : log.level == 3
                                                                ? "var(--error)"
                                                                : "var(--cardBackground)"
                                                }}>
                                                <Text
                                                    family={fontFamilies.regular}
                                                    size={14}>
                                                    {convertTimeToHours(log.time)}
                                                </Text>
                                                <Text
                                                    family={fontFamilies.bold}
                                                    size={14}>
                                                    {`${log.message}${log?.routine ? "" : " (system)"}`}
                                                </Text>
                                            </DrawerChild>)
                                    }
                                </DrawerFather>)
                            : <ScreenMessage
                                message={"No hay actividad para mostrar"}>
                            </ScreenMessage>
                    }
                </Drawer>
            </div>
        </div>);
}

export default LogsView;