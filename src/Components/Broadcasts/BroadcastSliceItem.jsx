import { PrismicLink, usePrismicDocumentByUID } from "@prismicio/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import FadeIn from "../../Animations/FadeIn";
import { ItemContainer } from "../ItemContainer";
import Loader from "../Loader";
import TeaserImage from "../TeaserImage/TeaserImage";

const BroadcastSliceItem = ({ uid }) => {
  const [isHovered, setHovered] = useState(false);
  const [document, { state, error }] = usePrismicDocumentByUID(
    "broadcasts",
    uid,
    {
      fetchLinks: "shows.title",
    }
  );
  useEffect(() => {
    // console.log(document, uid);
  }, [document]);
  if (state === "loading") return <Loader />;
  else if (state === "failed") return <></>;
  else if (state === "loaded")
    return (
      <FadeIn>
        <ItemContainer
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <PrismicLink
            field={document}
            className={clsx("image", { rotate: isHovered })}
          >
            <TeaserImage image={document.data.image} />
          </PrismicLink>
          <div className="meta">
            <PrismicLink field={document}>
              <h4>{document.data.title}</h4>
            </PrismicLink>
            by{" "}
            <PrismicLink field={document.data.hostedby}>
              {document.data.hostedby.data.title}
            </PrismicLink>
            <p>
              {dayjs(document.data.begin).format("ddd, MMM D, YYYY HH:mm")}{" "}
              &mdash; {dayjs(document.data.end).format("HH:mm")}
            </p>
          </div>
        </ItemContainer>
      </FadeIn>
    );
  return <></>;
};
export default BroadcastSliceItem;
