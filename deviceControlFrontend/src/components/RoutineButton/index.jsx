import "./routineButton.css";

const RoutineButton = ({children, onPress, color, disable}) => {

    const handleOnPress = (e) => {
        if (!disable) {
            onPress(e)
        }
    }

    return (
        <div 
            style={{
                backgroundColor: disable ? "var(--disabled)" : color || "var(--primary)",
            }}
            onClick={handleOnPress}
            className="routineButton">
            {children}
        </div>
    );
}

export default RoutineButton;