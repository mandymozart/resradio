import styled from "@emotion/styled";
import React, { useState } from "react";

const Container = styled.img`
    width: 100%;  
`;

const Image = ({ placeholderUrl, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [hasError] = useState(false);
    const style = !loaded ? { display: "none" } : {}
    const handleLoad = () => {
        setLoaded(true);
    }
    const handleError = () => {

    }
    return (<>
        {!loaded && (<img src={placeholderUrl} alt={hasError ? "Error" : "loading"} />)}
        <Container style={style} onLoad={handleLoad} onError={handleError} {...props} />
    </>)
}

export default Image;