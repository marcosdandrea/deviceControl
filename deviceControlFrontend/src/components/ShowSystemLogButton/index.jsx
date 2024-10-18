import { useState } from "react";
import { CheckDisabledIcon, CheckEnabledIcon } from "../Icons";
import RoutineButton from "../RoutineButton";
import Text from "../Text";

const ShowSystemLogButton = ({ setShowSystemLogs, showSystemLogs }) => {

    const handleOnShowSystemLogs = () => {
        setShowSystemLogs(!showSystemLogs)
    }

    return (
        <div
            onClick={handleOnShowSystemLogs}
            style={{ display: "flex", alignItems: "center", columnGap: "0.5rem" }}>
            <RoutineButton
                onPress={handleOnShowSystemLogs}>
                {
                    showSystemLogs ?
                        <CheckEnabledIcon color={"var(--cardBackground)"} />
                        : <CheckDisabledIcon color={"var(--cardBackground)"} />
                }
            </RoutineButton>
            <Text>
                mostrar registros del sistema
            </Text>
        </div>
    )
}

export default ShowSystemLogButton;