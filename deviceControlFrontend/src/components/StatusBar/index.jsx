import { useEffect, useRef, useState } from "react";
import "./statusBar.css"
import Text, { fontFamilies } from "../Text";
import { useSelector } from "react-redux";

const StatusBar = () => {

    const timerRef = useRef()
    const [time, setTime] = useState("00:00")
    const {localIP} = useSelector(state => state.system)

    useEffect(() =>{

        timerRef.current = setInterval(() => {
            const now = new Date()
            setTime(`${String(now.getHours()).padStart(2, 0)}:${String(now.getMinutes()).padStart(2, 0)}`)
        }, 1000) 

        return () => {
            clearInterval(timerRef.current)
        }

    },[])

    return ( 
    <div className="statusBar">
        <Text
            family={fontFamilies.regular}>
            {`${localIP}`}
        </Text>
        <Text
            family={fontFamilies.bold}>
            {`${time} hs`}
        </Text>
    </div> 
    );
}
 
export default StatusBar;