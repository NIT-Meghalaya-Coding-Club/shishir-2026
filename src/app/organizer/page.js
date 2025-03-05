"use client";

import React, { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import Loading from "../components/Loading";
import SearchIcon from "@mui/icons-material/Search";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DownloadIcon from "@mui/icons-material/Download";
import { useOrganizer } from "@/context/OrganizerContext";
import { useRouter } from "next/navigation";

const Organizer = () => {
  const [loading, setLoading] = useState(false);
  const [searchEntry, setSearchEntry] = useState("");
  const { organizer } = useOrganizer(null);
  const [participants, setParticipants] = useState([]);
  const router = useRouter();

  const eventId = "dance_comp"; // Hardcoded for testing; replace with dynamic logic later

  const filteredParticipants = useMemo(() => {
    if (!searchEntry) return participants;
    const searchLower = searchEntry.toLowerCase();
    return participants.filter((participant) => {
      const leader = participant.teamData[0] || {};
      const fullName = leader.name?.toLowerCase() || "";
      return (
        fullName.includes(searchLower) ||
        participant.userId.toLowerCase().includes(searchLower) ||
        leader.phone?.toLowerCase().includes(searchLower) ||
        participant.metadata?.eventType?.toLowerCase().includes(searchLower) ||
        participant.metadata?.groupName?.toLowerCase().includes(searchLower) ||
        participant.eventId?.toLowerCase().includes(searchLower)
      );
    });
  }, [participants, searchEntry]);

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/organizer/all-registered/${eventId}`
        );
        const data = await response.json();
        console.log("API Response:", data); // Debug: Log the response
        if (data.success) {
          setParticipants(data.registration || []);
        } else {
          console.error("API Error:", data.error);
          setParticipants([]);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId]); // Dependency on eventId instead of organizer.userId

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/organizer/auth/logout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        router.push("/organizer/login");
      }
    } catch (error) {
      console.error("Couldn't log out at the moment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchEntry = (e) => {
    setSearchEntry(e.target.value);
  };

  const handleDownloadExcel = () => {
    const data = filteredParticipants.map((team, index) => {
      const leader = team.teamData[0] || {};
      const members = team.teamData.slice(1);

      return {
        "Sl No.": index + 1,
        "Leader Name": leader.name || "N/A",
        "Leader Roll No.": leader.rollNumber || "N/A",
        "Leader Email": team.userId,
        "Leader Phone": leader.phone || "N/A",
        "Team Members": members
          .map(
            (member, memberIndex) =>
              `${memberIndex + 1}. ${member.name} (${
                member.rollNumber || "N/A"
              }, ${member.phone || "N/A"})`
          )
          .join(", "),
        "Event ID": team.eventId || "N/A",
        "Event Type": team.metadata?.eventType || "N/A",
        "Group Name": team.metadata?.groupName || "N/A",
        "Performance Type": team.metadata?.performanceType || "N/A",
        "Dynamic Event Code": team.metadata?.dynamicEventCode || "N/A",
        "Dynamic Event Type": team.metadata?.dynamicEventType || "N/A",
        "Min Participants": team.metadata?.minParticipants || "N/A",
        "Max Participants": team.metadata?.maxParticipants || "N/A",
        Timestamp: team.timestamp,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, `participants_${eventId}.xlsx`);
  };

  if (loading) return <Loading />;

  return (
    <div className="px-10 pb-10 pt-0 md:w-[80svw] w-screen">
      <div className="absolute w-screen h-[10svh] bg-gradient-to-b from-blue-950 to-blue-950 top-0 left-0"></div>
      <div className="flex flex-row justify-between md:mt-10 mt-40 mb-5">
        <h1 className="font-assistant text-2xl">@{organizer.userId}</h1>
        <button
          className="border blue-950 px-3 rounded-md hover:bg-blue-950 hover:text-white transition-all duration-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="border border-black border-opacity-5 px-10 py-5 rounded-md shadow-lg text-center">
          <h2 className="text-5xl font-thin font-anton">
            {participants?.length || " - "}
          </h2>
          <p className="font-assistant text-xl">Total Registrations</p>
        </div>
      </div>

      {/* Search Bar & Download Button */}
      <div className="flex md:flex-row flex-col gap-5 md:items-center my-4 mt-10">
        <div className="flex flex-row items-center gap-3 w-fit bg-[#D9D9D9] text-black px-2 rounded-md">
          <input
            type="search"
            name="searchEntry"
            id="searchEntry"
            placeholder="Search "
            value={searchEntry}
            onChange={handleSearchEntry}
            className="px-2 bg-[#D9D9D9] py-1 font-medium focus:outline-none"
          />
          <SearchIcon className="cursor-pointer" />
        </div>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 h-fit rounded-md hover:bg-green-700"
        >
          <DownloadIcon />
          Download Excel
        </button>
      </div>

      {/* Participants Table */}
      <div className="overflow-x-auto md:max-w-[60vw] w-full mt-5">
        <p>
          Scroll <ArrowRightIcon sx={{ paddingBottom: "2px" }} />
        </p>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Sl No.</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Roll No.</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Team Members</th>
              <th className="border p-2">Event ID</th>
              <th className="border p-2">Event Type</th>
              <th className="border p-2">Group Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants?.length > 0 ? (
              filteredParticipants.map((team, index) => {
                const leader = team.teamData[0] || {};
                const members = team.teamData.slice(1);
                return (
                  <tr key={team._id} className="text-center">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{leader.name || "N/A"}</td>
                    <td className="border p-2">{leader.rollNumber || "N/A"}</td>
                    <td className="border p-2">{team.userId}</td>
                    <td className="border p-2">{leader.phone || "N/A"}</td>
                    <td className="border">
                      {members.length > 0 ? (
                        <table className="w-full border-none">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border border-l-white border-t-white p-2">
                                SI No.
                              </th>
                              <th className="border border-t-white p-2">
                                Name
                              </th>
                              <th className="border border-t-white p-2">
                                Roll No.
                              </th>
                              <th className="border border-t-white border-r-white p-2">
                                Phone
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {members.map((member, memberIndex) => (
                              <tr key={member._id}>
                                <td
                                  className={`border border-l-white ${
                                    memberIndex + 1 === members.length
                                      ? "border-b-white"
                                      : ""
                                  } p-2`}
                                >
                                  {memberIndex + 1}
                                </td>
                                <td
                                  className={`border ${
                                    memberIndex + 1 === members.length
                                      ? "border-b-white"
                                      : ""
                                  } p-2`}
                                >
                                  {member.name || "N/A"}
                                </td>
                                <td
                                  className={`border ${
                                    memberIndex + 1 === members.length
                                      ? "border-b-white"
                                      : ""
                                  } p-2`}
                                >
                                  {member.rollNumber || "N/A"}
                                </td>
                                <td
                                  className={`border border-r-white ${
                                    memberIndex + 1 === members.length
                                      ? "border-b-white"
                                      : ""
                                  } p-2`}
                                >
                                  {member.phone || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                    <td className="border p-2">{team.eventId || "N/A"}</td>
                    <td className="border p-2">
                      {team.metadata?.eventType || "N/A"}
                    </td>
                    <td className="border p-2">
                      {team.metadata?.groupName || "N/A"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="border p-2 text-center">
                  No participants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Organizer;
