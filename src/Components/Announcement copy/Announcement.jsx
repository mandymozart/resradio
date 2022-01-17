import { usePrismicDocumentsByType } from "@prismicio/react"
import React, { useEffect } from "react"

const Announcement = () => {
    const [documents] = usePrismicDocumentsByType('announcement')
    useEffect(() => {
        console.log(documents)

    }, [documents])
    if(!documents)    
    return <></>
    return (
        <div style={{backgroundColor: documents.results[0].data.backgroundcolor,color: documents.results[0].data.textcolor}}>{documents.results[0].data.text}</div>
    )
}
export default Announcement;