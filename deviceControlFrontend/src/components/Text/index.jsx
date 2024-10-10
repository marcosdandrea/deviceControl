
export const fontFamilies = {
    regular: "Roboto-Regular",
    italic: "Roboto-Italic",
    medium: "Roboto-Medium",
    light: "Roboto-Light",
    thin: "Roboto-Thin",
    bold: "Roboto-Bold",
    black: "Roboto-Black"
}

const Text = ({ children, size, family, color, style }) => {
    return (
        <div style={{
            fontFamily: family || fontFamilies[0],
            fontSize: size || 16,
            color: color || "var(--fonts)",
            ...style
        }}>
            {children}
        </div>);
}

export default Text;