const ExpandIcon = ({ color, size }) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" height={size || "24px"} viewBox="0 -960 960 960" width={size || "24px"} fill={color || "var(--fonts)"}>
            <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
            </svg>
        </div>
    );
}

export default ExpandIcon;