import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
rect {
    fill: url("#fill");
}
`
const SkeletonLoader = ({ width, fontSize, className }) => {
    if (fontSize === undefined) fontSize = 1
    if (width === undefined) width = 12
    return (<Container>
        <svg style={{ display: "block" }} className={className} role="img" width={16 * width} height={16 * fontSize * 1.25} aria-labelledBy="loading-aria" viewBox={`0 0 ${16 * width} ${16 * fontSize * 1.25}`} preserveAspectRatio="none">
            <title id="loading-aria">Loading...</title>
            <rect x="0" y="0" width={16 * width} height={16 * fontSize} clipPath="url(#clip-path)"></rect>
            <defs>
                <clipPath id="clip-path">
                    <rect x="0" y="0" rx="0" ry="0" width={16 * width} height={16 * fontSize} />
                </clipPath>
                <linearGradient id="fill">
                    <stop offset="0.599964" stopColor="var(--grey)" stopOpacity="1">
                        <animate attributeName="offset" values="-2; -2; 1" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>
                    </stop>
                    <stop offset="1.59996" stopColor="var(--background)" stopOpacity="1">
                        <animate attributeName="offset" values="-1; -1; 2" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>
                    </stop>
                    <stop offset="2.59996" stopColor="var(--grey)" stopOpacity="1">
                        <animate attributeName="offset" values="0; 0; 3" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>
                    </stop>
                </linearGradient>
            </defs>
        </svg>    </Container>
    )
}

export default SkeletonLoader;