import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { GetMoodsQuery } from "../../Queries/moods";
import { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS } from "../../config";
import SectionLoader from "../SectionLoader";
import Mood from "./Mood";

const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
@media (max-width: ${BREAKPOINT_L}px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
@media (max-width: ${BREAKPOINT_MD}px) {
      grid-template-columns: 1fr 1fr ;
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
gap: 2rem;
padding-bottom: 2rem;
`;

const MoodFilter = () => {
    const { loading, error, data } = useQuery(GetMoodsQuery)

    if (loading) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    return (
        <Container>
            {data?.allMoods.edges.map((mood) => {
                return <Mood mood={mood.node} key={mood.node._meta.id} />
            })}
        </Container>
    )
}

export default MoodFilter;

