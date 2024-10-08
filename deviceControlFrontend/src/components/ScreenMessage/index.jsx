import Text from "../Text";
import "./ScreenMessage.css";

const ScreenMessage = ({children, message}) => {
    return ( 
    <div className="screenMessage">
        {children}
        <Text
            color={"var(--cardBackground)"}>
            {message}
        </Text>
    </div> );
}
 
export default ScreenMessage;