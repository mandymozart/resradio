import useMouse from "@react-hook/mouse-position";
import { useEffect, useRef } from "react";
import useThemeStore from "../Stores/ThemeStore";

const MousePositionProvider = ({ children }) => {
    const setMousePosition = useThemeStore((store) => store.setMousePosition);
    const ref = useRef(null);
    const mouse = useMouse(ref, {
        enterDelay: 100,
        leaveDelay: 100,
    });
    useEffect(() => {
        setMousePosition({ x: mouse.screenX, y: mouse.screenY });
    }, [mouse, setMousePosition]);

    return <div ref={ref}>{children}</div>;
};

export default MousePositionProvider;