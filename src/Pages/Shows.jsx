import React, { useEffect } from "react";
import Layout from "../Components/Layout";
import ShowList from "../Components/Shows/ShowList";
import useThemeStore from "../Stores/ThemeStore";

const Shows = () => {
    const setKeyword = useThemeStore((store) => store.setKeyword);
    useEffect(()=>{
        setKeyword("spectacle")
    },[setKeyword])
    return (
        <Layout>
            <ShowList/>
        </Layout>
    );
};

export default Shows;
