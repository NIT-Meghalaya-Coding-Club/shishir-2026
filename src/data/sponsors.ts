import { defaultSponsorImage } from "../../public/images";

export const defaultSponsorImageUrl = defaultSponsorImage;

export const sponsors: {
    [key: string]: {
      name: string;
      sponsorType: string;
      imageLink: string | undefined;
    }[];
} = {
    "Title Sponsor": [
      {
        name: "Polo Orchid",
        sponsorType: "Title Sponsor",
        imageLink: "/sponsors/poloorchid.webp",
      }
    ],
    "Powered By": [
      {
        name: "State Bank of India",
        sponsorType: "Banking",
        imageLink: "/sponsors/sbi.webp",
      },
      {
        name: "Canara Bank",
        sponsorType: "Banking",
        imageLink: "/sponsors/canara-bank.webp",
      },
      {
        name: "Pantaloons",
        sponsorType: "Retail",
        imageLink: "/sponsors/pantaloons.webp",
      }
    ],
    "Co-Powered By": [
      {
        name: "RITES",
        sponsorType: "Engineering Consultancy",
        imageLink: "/sponsors/rites.webp",
      },
      {
        name: "NECTAR",
        sponsorType: "Technology & Research",
        imageLink: "/sponsors/necar.webp",
      }
    ]
};
