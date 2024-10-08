import Text, { fontFamilies } from "../Text";
import "./standarButton.css"

const StandarButton = ({ children, label, onPress, style }) => {
    return (
        <div
            onClick={onPress}
            style={style}
            className="standarButton">
            <Text
                family={fontFamilies.bold}
                color={"var(--cardBackground)"}>
                {label}
            </Text>
            {children}
        </div>
    );
}

export default StandarButton;