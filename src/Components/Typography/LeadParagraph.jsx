import styled from "@emotion/styled";
import { BREAKPOINT_MD, BREAKPOINT_XS } from "../../config";

export const LeadParagraph = styled.p`
width: 50%;
padding: 0 2rem;
font-size: 1rem;
margin-top: 0;
@media (max-width: ${BREAKPOINT_MD}px) {
    width: auto;
}
@media (max-width: ${BREAKPOINT_XS}px) {
    padding: 0 1rem;
    margin-bottom: 1rem;
}
`