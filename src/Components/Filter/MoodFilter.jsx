import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Select from 'react-select';
import { GetTagsQuery } from "../../Queries/tags";
import useFilterStore from "../../Stores/FilterStore";
import SectionLoader from "../SectionLoader";
import Mood from "./Mood";

const Container = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
gap: 2rem;
padding-bottom: 2rem;
`;

const MoodFilter = ({ id }) => {
    const { loading, error, data } = useQuery(GetTagsQuery, { variables: { categoryId: id } })

    const { moods, setMoods } = useFilterStore();

    function handleSelect(data) {
        setMoods(data);
    }

    if (loading) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    const moodOptions = data.allTags.edges.map((tag) => {
        console.log(tag)
        return { value: tag.node._meta.id, name: tag.node.name, description: tag.node.description }
    })
    const tagOptions = data.allTags.edges.map((tag) => {
        console.log(tag)
        return { value: tag.node._meta.id, label: tag.node.name }
    })
    return (
        <Container>
            {moodOptions.map((mood) => {
                return <Mood mood={mood} selected={moods.find(m => m.value === mood.value)} />
            })}
            <label>
                <Select isMulti
                    options={tagOptions}
                    value={moods}
                    onChange={handleSelect}
                    className="react-select-container"
                    classNamePrefix="react-select"
                />

            </label>
        </Container>
    )
}

export default MoodFilter;

