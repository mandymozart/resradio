
import React, { useEffect, useState } from 'react';
import { queryPosts } from '../../../utils/prismicQueries';
import { PostList } from '../../blog-home';
import LoadMoreButton from './LoadMoreButton';

const InfiniteBroadcastsLoader = ({ itemsPerPage }) => {
    const [broadcasts, setBroadcasts] = useState([]);
    const [currentCursor, setCurrentCursor] = useState(null);
    const [hasMoreBroadcasts, setHasMoreBroadcasts] = useState(true);

    const renderMorePosts = (currentBlogPosts, morePosts) => {
        const newPosts = morePosts.edges.map((post) => post.node);
        setBroadcasts([...currentBlogPosts, ...newPosts]);

        const lastNewPost = morePosts.edges[morePosts.edges.length - 1];
        setCurrentCursor(lastNewPost.cursor);

        if (!morePosts.pageInfo.hasNextPage) {
            setHasMoreBroadcasts(false);
        }
    };

    const loadMorePosts = async () => {
        const morePosts = await queryPosts(currentCursor, itemsPerPage);
        renderMorePosts(broadcasts, morePosts.data.allPosts);
    };

    // Fetch the first batch of posts when the component mounts
    useEffect(() => {
        const fetchInitialPosts = async () => {
            const initialCursor = null;
            const initialPosts = await queryPosts(initialCursor, itemsPerPage);
            renderMorePosts([], initialPosts.data.allPosts);
        };
        fetchInitialPosts();
    }, [itemsPerPage]);

    return (
        <>
            <PostList posts={broadcasts} />
            <LoadMoreButton
                hasMorePosts={hasMoreBroadcasts}
                onClick={loadMorePosts}
            />
        </>
    );
};

export default InfiniteBroadcastsLoader;