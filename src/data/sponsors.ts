import { defaultSponsorImage } from "../../public/images";

export const defaultSponsorImageUrl = defaultSponsorImage;

export const sponsors: {
    [key: string]: {
      name: string;
      sponsorType: string;
      imageLink: string | undefined;
    }[];
  } = {
    "Marketing Sponsors": [
      {
        name: "sponsor1",
        sponsorType: "sponsorType1",
        imageLink: undefined,
      },
      {
        name: "sponsor2",
        sponsorType: "sponsorType2",
        imageLink: undefined,
      },
      {
        name: "sponsor3",
        sponsorType: "sponsorType3",
        imageLink: undefined,
      },
      {
        name: "sponsor3",
        sponsorType: "sponsorType3",
        imageLink: undefined,
      },
      {
        name: "sponsor3",
        sponsorType: "sponsorType3",
        imageLink: undefined,
      },
    ],
    "Media Sponsors": [
      {
        name: "sponsor4",
        sponsorType: "sponsorType4",
        imageLink: undefined,
      },
      {
        name: "sponsor5",
        sponsorType: "sponsorType5",
        imageLink: undefined,
      },
    ],
    "Technology Sponsors": [
      {
        name: "sponsor6",
        sponsorType: "sponsorType6",
        imageLink: undefined,
      },
      {
        name: "sponsor7",
        sponsorType: "sponsorType7",
        imageLink: undefined,
      },
    ],
    "Logistics Sponsors": [
      {
        name: "sponsor8",
        sponsorType: "sponsorType8",
        imageLink: undefined,
      },
      {
        name: "sponsor9",
        sponsorType: "sponsorType9",
        imageLink: undefined,
      },
    ],
    "Education Sponsors": [
      {
        name: "sponsor10",
        sponsorType: "sponsorType10",
        imageLink: undefined,
      },
      {
        name: "sponsor11",
        sponsorType: "sponsorType11",
        imageLink: undefined,
      },
    ],
  };
  