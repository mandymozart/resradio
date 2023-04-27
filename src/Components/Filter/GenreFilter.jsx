import styled from "@emotion/styled";
import useSWR from "swr";
import useIsMounted from "../../Hooks/isMounted";
import SectionLoader from "../SectionLoader";
import Genre from "./Genre";

const Container = styled.div`
margin-bottom: 1.5rem;
`;

const GenreFilter = () => {
    const isMounted = useIsMounted()
    const fetcher = (...args) => fetch(...args).then(res => res.json());
    const { loading, error, data } = useSWR(isMounted ? "https://resradio.cdn.prismic.io/api/tags" : null, fetcher)

    if (loading) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    return (
        <Container>
            {data?.map(genre =>
                <Genre key={genre}
                    genre={genre}
                />
            )}
        </Container>
    )
}

export default GenreFilter
