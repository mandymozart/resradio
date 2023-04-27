import styled from "@emotion/styled";
import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import TempoRangeSlider from "../RangeSlider/TempoRangeSlider";
import FilterSummary from "./FilterSummary";
import GenreFilter from "./GenreFilter";
import MoodFilter from "./MoodFilter";

const Container = styled.div`
margin-bottom: 2rem;
`;

const FilterForm = () => {
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
            <FilterSummary />
        </Container>
    )
}

export default FilterForm;