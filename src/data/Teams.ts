import { defaultPhoto } from "../../public/images";

export const defaultImageUrl = defaultPhoto;

export const Teams: {
  [key: string]: {
    name: string;
    contactNo: string;
    email: string;
    position: string;
    linkedinLink: string | undefined;
    imageLink?: string | undefined;
  }[];
} = {
  "Student Activity Center (SAC)": [
    {
      name: "Dr. Paonam Sudeep Mangang",
      contactNo: "+91 9485177004",
      email: "paonam.sudeep@nitm.ac.in",
      position: "Dean Student's Welfare",
      linkedinLink: undefined,
      imageLink: "/Teams/Paonam.webp",
    },
    {
      name: "Dr. Atanu Singha Roy ",
      contactNo: "+91 9402102387",
      email: "asroy86@nitm.ac.oin",
      position: "SAC President",
      linkedinLink: undefined,
      imageLink: "/Teams/Atanu.webp",
    },
    {
      name: "Dr. Susmita Sharma",
      contactNo: "+91 9402102414",
      email: "susmita.sharma4@nitm.ac.in",
      position: "Vice President Cultural",
      linkedinLink: undefined,
      imageLink: "/Teams/Susmita.webp",
    },
    {
      name: "Himanshu Kashyap",
      contactNo: "+91 6205986263",
      email: "b21ce002@nitm.ac.in",
      position: "GS-I, Cultural",
      linkedinLink: undefined,
      imageLink: "/Teams/himanshu.webp",
    },
    {
      name: "Rohan Sangma",
      contactNo: "+91 7005231190",
      email: "b22ec035@nitm.ac.in",
      position: "GS-II, Cultural",
      linkedinLink: undefined,
      imageLink: "/Teams/RohanSangma.webp",
    },
    {
      name: "Bhabok Myrchiang",
      contactNo: "+91 9362756221 ",
      email: "b23ee029@nitm.ac.in",
      position: "GS Member-I, Cultural",
      linkedinLink: undefined,
      imageLink: "/Teams/BhabokMyrchiang.webp",
    },
    {
      name: "Chuncha Hemchand",
      contactNo: "+91 7386618846",
      email: "b23cs020@nitm.ac.in",
      position: "GS Member-II, Cultural",
      linkedinLink: undefined,
      imageLink: "/Teams/ChunchaHemchand.webp",
    },
  ],
};
