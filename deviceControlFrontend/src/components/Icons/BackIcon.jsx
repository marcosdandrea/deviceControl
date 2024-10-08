const BackIcon = ({ color, size }) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" height={size || "24px"} viewBox="0 -960 960 960" width={size || "24px"} fill={color || "var(--fonts)"}>
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
            </svg>
        </div>
    );
}

export default BackIcon;