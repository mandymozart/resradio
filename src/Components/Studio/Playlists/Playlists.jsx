import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import React from "react";
import { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS } from '../../../config';
import Button from '../../Button';
import { getPlaylistsQuery } from './../../../Queries/playlists';
import PlaylistItem from './PlaylistItem';

const Container = styled.div`
padding: 2rem;
@media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem;
}
h4 {
    margin: 0 0 3rem 0;
    @media (max-width: ${BREAKPOINT_XS}px) {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
    }
}
.list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0,1fr));
    gap: 2rem;
    @media (max-width: ${BREAKPOINT_L}px) {
        grid-template-columns: repeat(3, minmax(0,1fr));
    }
    @media (max-width: ${BREAKPOINT_MD}px) {
        grid-template-columns: repeat(2, minmax(0,1fr));
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
.add {
  padding: 2rem;
  text-align: center;
}
`

const Playlists = () => {
    const { loading, error, data } = useQuery(getPlaylistsQuery);

    if (loading) return <>Loading...</>;
    if (error) return <>Error : {error.message}</>;
    return (
        <Container>
            <h4>Playlists ({data.allPlaylists.totalCount})</h4>
            <div className='list'>
                {data.allPlaylists.edges.map((item) => {
                    return (
                        <PlaylistItem playlist={item.node} key={item.node._meta.id} />
                    )
                }
                )}
            </div>
            <div className="add"><Button>
                <a href="http://resradio.prismic.io" target="_blank" rel="noreferrer">Add Playlist</a>
            </Button>
            </div>
        </Container>
    )
}

export default Playlists