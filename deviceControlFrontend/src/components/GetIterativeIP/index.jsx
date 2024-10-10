import { useContext, useEffect, useRef } from "react";
import { socketContext } from "../Socket";
import { useDispatch, useSelector } from "react-redux";
import { setLocalIP } from "../Store/system.slice";


const GetIterativeIP = () => {
    const {connected} = useSelector(state => state.system)
    const interativeTimer = useRef(null)
    const dispatch = useDispatch()
    const { emit } = useContext(socketContext)

    const getIP = () => {
        emit({
            channel: "getIP",
            cb: (ip) => dispatch(setLocalIP(ip))
        })
    }

    useEffect(() => {
        getIP()

        interativeTimer.current = setInterval(getIP, 15000)

        return (() => clearInterval(interativeTimer.current))

    }, [connected])


    emit({
        channel: "getIP",
        cb: (ip) => dispatch(setLocalIP(ip))
    })




    return (<></>);
}

export default GetIterativeIP;