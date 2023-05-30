export default {
  name: "playback",
  title: "Playback",
  type: "document",
  fields: [
    {
      name: "referenceText",
      title: "Reference Text",
      type: "string"
    },
    {
      name: "showPrismicId",
      title: "Show Prismic Id",
      type: "string"
    },
    {
      name: "prismicId",
      title: "Prismic Broadcast Id",
      type: "string"
    },
    {
      name: "date",
      title: "Date",
      type: "datetime",
    },
    {
      name: "timezone",
      title: "Timezone",
      type: "string",
    }
  ],
  preview: {
    select: {
      title: "referenceText",
      subtitle: "date",
    },
  },
};
