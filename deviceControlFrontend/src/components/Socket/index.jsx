import "./style.css"
import { createContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { setLocalIP, setRoutine, setRoutines, setServerURL, setSocketConnected } from '../Store/system.slice'

const socketContext = createContext()
const url = window.location.host.split(":")
const socket = io.connect(`${url[0]}:3030`)

const SocketContext = ({ children }) => {

    const dispatch = useDispatch()
    dispatch(setServerURL(`http://${url[0]}`))

    const handleOnConnect = () => {
        console.log('Conectado al socket')
        dispatch(setSocketConnected(true))

        emit({
            channel: 'getRoutines',
            cb: (routines) => dispatch(setRoutines(routines))
        })

        emit({
            channel: "getIP",
            cb: (ip) => dispatch(setLocalIP(ip))
        })
    }

    const handleOnDisconnect = () => {
        console.log('Desconectado del socket')
        dispatch(setSocketConnected(false))
    }

    const handleOnSetRoutine = (routines) => {
        dispatch(setRoutine(routines))
    }

    useEffect(() => {

        socket.on('connect', handleOnConnect);
        socket.on('disconnect', handleOnDisconnect);
        socket.on('setRoutine', handleOnSetRoutine);

        return (() => {
            socket.off('connect', handleOnConnect)
            socket.off('disconnect', handleOnDisconnect)
            socket.off('setRoutine', handleOnSetRoutine);
        })


    }, [])


    const emit = ({ channel, value, cb }) => {
        if (!socket.connected) return
        socket.emit(channel, value, cb)
    }

    return (
        <div className='socketContext'>
            <socketContext.Provider value={{ emit }}>
                {children}
            </socketContext.Provider>
        </div>
    )

}


export default SocketContext