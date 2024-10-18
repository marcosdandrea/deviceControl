import { useEffect, useRef, useState } from "react";
import "./routineStatusIndicator.css"

export const RoutineStates = Object.freeze({
    unknown: "unknown",
    fullfiled: "fullfiled",
    armed: "armed",
    error: "error",
    failed: "error",
    working: "working"
})

const RoutineStatusIndicator = ({ state, routineEnabled }) => {

    const routineStatusRef = useRef(null)
    const [showLoader, setShowLoader] = useState(false)
    const [routineRect, setRoutineRect] = useState({})

    useEffect(() => {
        setShowLoader(state === RoutineStates.working)
    }, [state])

    useEffect(() => {
        if (!routineStatusRef.current) return
        const routineElement = routineStatusRef.current.parentNode
        const routineRect = routineElement.getBoundingClientRect()
        setRoutineRect (routineRect)
    }, [routineStatusRef])

    return (
        <div
            ref={routineStatusRef}
            className="routineStatusIndicator"
            style={{
                backgroundColor: routineEnabled ? `var(--${RoutineStates[state]})` : "GrayText",
                width: showLoader ? `${routineRect.height}px` : "0.5rem"
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