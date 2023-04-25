import styled from "@emotion/styled";
import Accordion from "../Accordion/Accordion";
import AccordionItem from "../Accordion/AcordionItem";
import FilterSummary from "./FilterSummary";
import { GenreFilter } from "./GenreFilter";
import MoodFilter from "./MoodFilter";
import { TempoFilter } from "./TempoFilter";

const Container = styled.div`
margin-bottom: 2rem;
`;

const FilterForm = () => {


    return (
        <Container>
            <Accordion onItemClick={console.log}>
                <AccordionItem label="Mood" index="1">
                    <MoodFilter />
                </AccordionItem>
                <AccordionItem label="Genre" index="2">
                    <GenreFilter />
                </AccordionItem>
                <AccordionItem label="Tempo" index="3">
                    <TempoFilter />
                </AccordionItem>
            </Accordion>
            <FilterSummary />
        </Container>
    )
}

export default FilterForm;