const PlayIcon = ({ color, size }) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" height={size || "24px"} viewBox="0 -960 960 960" width={size || "24px"} fill={color || "var(--fonts)"}>
                <path d="M320-200v-560l440 280-440 280Z" />
            </svg>
        </div>
    );
}

export default PlayIcon;