import styled from '@emotion/styled';
import React from "react";
import { Link } from 'react-router-dom';

const Container = styled.div`
padding: 2rem;
border-bottom: 2px solid var(--color); 
`

const PlaylistItem = ({ playlist }) => {
    return (<Container>
        <h3>
            {playlist.title}
        </h3>
        <p>
            {playlist.description}
        </p>
        <Link to={`${playlist._meta.uid}`}>Select</Link>
    </Container>)
}

export default PlaylistItem;