import { useEffect, useState } from "react";
import "./routineStatusIndicator.css"

export const RoutineStates = Object.freeze({
    unknown: "unknown",
    fullfiled: "fullfiled",
    armed: "armed",
    error: "error",
    failed: "error",
    working: "working"
})

const RoutineStatusIndicator = ({ state }) => {

    const [showLoader, setShowLoader] = useState(false)

    useEffect(() => {
        setShowLoader(state === RoutineStates.working)
    }, [state])

    return (
        <div
            className="routineStatusIndicator"
            style={{
                backgroundColor: `var(--${RoutineStates[state]})`,
                width: showLoader ? "3rem" : "0.5rem"
            }}>
            {
                showLoader
                    ? <div className="loaderContainer">
                        <div className="loader" />
                    </div>
                    : <></>
            }
        </div>
    );
}

export default RoutineStatusIndicator;