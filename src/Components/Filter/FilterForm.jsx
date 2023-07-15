import styled from "@emotion/styled";
import { Accordion, } from '@szhsin/react-accordion';
import { useEffect, useRef, useState } from "react";
import useFilterStore from "../../Stores/FilterStore";
import { BREAKPOINT_XS } from "../../config";
import AccordionItem from "../Accordion/AcordionItem";
import TempoRangeSlider from "../RangeSlider/TempoRangeSlider";
import FilterSummary from "./FilterSummary";
import GenreFilter from "./GenreFilter";
import MoodFilter from "./MoodFilter";

const Container = styled.div`
margin-bottom: 2rem;
color: var(--color);
.szh-accordion__item-btn.true svg {
    transform: rotate(180deg);
}
@media (max-width: ${BREAKPOINT_XS}px) {
    margin-bottom: 1rem;
}
`;

const FilterForm = () => {
    const { genres, moods, tempos } = useFilterStore();
    const summaryRef = useRef();
    const { isInitial, setIsInitial } = useState(true);

    useEffect(() => {
        if (isInitial)
            setIsInitial(false)
        else summaryRef.current.scrollIntoView({ behavior: "smooth" });
    }, [genres, moods, tempos])
    return (
        <Container>
            <Accordion>
                <AccordionItem header="Mood">
                    <MoodFilter />
                </AccordionItem>
                <AccordionItem header="Genre">
                    <GenreFilter />
                </AccordionItem>
                <AccordionItem header="Tempo">
                    <TempoRangeSlider />
                </AccordionItem>
            </Accordion>
            <div ref={summaryRef}></div>
            <FilterSummary />
        </Container>
    )
}

export default FilterForm;