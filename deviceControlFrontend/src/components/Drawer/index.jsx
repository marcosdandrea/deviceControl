import "./drawer.css"
import Text, { fontFamilies } from "../Text";
import { createContext, useContext, useEffect, useState } from "react";
import { ExpandIcon } from "../Icons";

const drawerContext = createContext()

const Drawer = ({ children }) => {

    const [selectedFather, setSelectedFather] = useState(undefined)

    return (
        <drawerContext.Provider value={{ selectedFather, setSelectedFather }}>
            <div className="drawer">
                {children}
            </div>
        </drawerContext.Provider>
    );
}

export const DrawerFather = ({ id, title, buttons, children }) => {

    const { selectedFather, setSelectedFather } = useContext(drawerContext)
    const [open, setOpen] = useState(false)

    const handleOnClickOnFather = () => {
        setSelectedFather(id)
        if (selectedFather == id)
            setOpen(!open)
    }

    useEffect(() => {
        if (selectedFather == id) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [selectedFather])


    return (
        <div
            onClick={handleOnClickOnFather}
            style={{
                height: open ? "800px" : 0,
                overflowY: open ? "auto" : "hidden"
            }}
            className="drawerFather">
            <div className="fatherTitle">
                <div style={{
                    rotate: open ? "0deg" : "180deg"
                }}>
                    <ExpandIcon />
                </div>
                <Text
                    family={fontFamilies.bold}
                    size={14}>
                    {title}
                </Text>
                <div className="buttons">
                    {buttons}
                </div>
            </div>
            <div className="fatherChildrens">
                {open ? children : null}
            </div>
        </div>
    );
}

export const DrawerChild = ({ children, style }) => {
    return (
        <div
            style={style}
            className="drawerChild">
            <div className="childrenContainer">
                {children}
            </div>
        </div>
    );
}

export default Drawer;