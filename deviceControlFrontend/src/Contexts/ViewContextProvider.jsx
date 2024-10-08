import { createContext, useState } from "react";
import { useSelector } from "react-redux";
import StatusBar from "../components/StatusBar";
import ScreenMessage from "../components/ScreenMessage";
import { WarningIcon } from "../components/Icons";

export const viewContext = createContext()

export const VIEWS = Object.freeze({
    routines: "ROUTINES",
    logs: "LOGS",
})

const ViewContextProvider = ({ children }) => {
    const { socketConnected } = useSelector(state => state.system)
    const [currentView, setCurrentView] = useState(VIEWS.routines)
    const [selectedRoutineID, setSelectedRoutineID] = useState(undefined)

    return (
        <viewContext.Provider value={{ currentView, setCurrentView, selectedRoutineID, setSelectedRoutineID }}>
            <div style={{
                width: '100%',
                display: "flex",
                flexDirection: 'column'
            }}>
                {
                    socketConnected
                        ? children.filter(child => child.key === currentView)
                        :
                        <ScreenMessage
                            message={"Se produjo un error de conexión con el servidor de la aplicación."}>
                            <WarningIcon
                                color={"var(--cardBackground)"}
                                size={40}
                            />
                        </ScreenMessage>

                }
                <StatusBar />
            </div>
        </viewContext.Provider>
    );
}

export default ViewContextProvider;