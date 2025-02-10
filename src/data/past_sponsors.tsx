import { defaultSponsorImage } from "../../public/images";

export const defaultSponsorImageUrl = defaultSponsorImage;

export const sponsors: {
    [key: string]: {
      name: string;
      sponsorType: string;
      imageLink: string | undefined;
    }[];
  } = {
    "Banking Sponsors": [
      {
        name: "Union Bank of India",
        sponsorType: "Banking",
        imageLink: "/sponsors/union-bank.webp",
      },
      {
        name: "State Bank of India",
        sponsorType: "Banking",
        imageLink: "/sponsors/sbi.jpg",
      },
      {
        name: "ICICI Bank",
        sponsorType: "Banking",
        imageLink: "/sponsors/icici.jpg",
      },
      {
        name: "Canara Bank",
        sponsorType: "Banking",
        imageLink: "/sponsors/canara-bank.jpg",
      }
    ],
    "Government Organizations": [
      {
        name: "North Eastern Council Shillong",
        sponsorType: "Government",
        imageLink: "/sponsors/nec-shillong.png",
      },
      {
        name: "NEEPCO",
        sponsorType: "Power Corporation",
        imageLink: "/sponsors/neepco.png",
      },
      {
        name: "MBDA Meghalaya",
        sponsorType: "Development Authority",
        imageLink: "/sponsors/mbda.png",
      }
    ],
    "Technology Sponsors": [
      {
        name: "EPSON",
        sponsorType: "Technology",
        imageLink: "/sponsors/epson.png",
      }
    ],
    "Research & Education": [
      {
        name: "NECAR",
        sponsorType: "Research",
        imageLink: "/sponsors/necar.jpg",
      },
      {
        name: "SCSTE",
        sponsorType: "Science & Technology",
        imageLink: "/sponsors/scste.jpg",
      }
    ],
    "Industrial Sponsors": [
      {
        name: "Star Cement",
        sponsorType: "Construction",
        imageLink: "/sponsors/star-cement.jpg",
      }
    ]
  };