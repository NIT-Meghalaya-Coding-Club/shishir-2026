"use client";

import React, { useEffect, useState, useMemo } from "react";

// Components
import Loading from "../components/Loading";

// MUI Icons
import SearchIcon from "@mui/icons-material/Search";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// Context
import { useOrganizer } from "@/context/OrganizerContext";

const Organizer = () => {
  const [loading, setLoading] = useState(false);
  const [searchEntry, setSearchEntry] = useState("");
  const { organizer } = useOrganizer(null);
  const [participants, setParticipants] = useState([]);

  // Add filtered data using useMemo
  const filteredParticipants = useMemo(() => {
    if (!searchEntry) return participants;
    const searchLower = searchEntry.toLowerCase();
    return participants.filter((participant) => {
      const fullName =
        `${participant.firstname} ${participant.lastname}`.toLowerCase();
      return (
        fullName.includes(searchLower) ||
        participant.email.toLowerCase().includes(searchLower) ||
        participant.phone.toLowerCase().includes(searchLower) ||
        participant.city.toLowerCase().includes(searchLower) ||
        participant.state.toLowerCase().includes(searchLower) ||
        participant.sport.toLowerCase().includes(searchLower)
      );
    });
  }, [participants, searchEntry]);

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/organizer/all-registered/${organizer.userId}`
        );
        const data = await response.json();
        if (data.success) {
          setParticipants(data.registration);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const handleSearchEntry = (e) => {
    setSearchEntry(e.target.value);
  };

  if (loading) return <Loading />;

  return (
    <div className="px-10 pb-10 pt-40 md:w-[80svw] w-screen">
      <h1 className="font-assistant text-2xl">Dashboard</h1>
      <p className="text-3xl">{organizer?.name}</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="border border-black border-opacity-5 px-10 py-5 rounded-md shadow-lg text-center">
          <h2 className="text-5xl font-thin font-anton">
            {participants?.length || " - "}
          </h2>
          <p className="font-assistant text-xl">Total Registrations</p>
        </div>
        <div className="border border-black border-opacity-5 px-10 py-5 rounded-md shadow-lg text-center">
          <h2 className="text-5xl font-thin font-anton">0</h2>
          <p className="font-assistant text-xl">Selected</p>
        </div>
        <div className="border border-black border-opacity-5 px-10 py-5 rounded-md shadow-lg text-center">
          <h2 className="text-5xl font-thin font-anton">0</h2>
          <p className="font-assistant text-xl">Paid Participation Fee</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-row items-center gap-3 w-fit bg-[#D9D9D9] text-black px-2 my-4 rounded-md">
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

      {/* Participants Table */}
      <div className="overflow-x-auto w-full mt-5">
        <p>
          Scroll <ArrowRightIcon sx={{ paddingBottom: "2px" }} />
        </p>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Sl No.</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Team Members</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants?.length > 0 ? (
              filteredParticipants.map((team, index) => {
                const leader = team.teamMembers[0];
                const members = team.teamMembers.slice(1);
                return (
                  <tr key={team._id} className="text-center">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{leader.name}</td>
                    <td className="border p-2">{team.userId}</td>
                    <td className="border p-2">{leader.phone}</td>
                    <td className="border p-2">
                      {members.length > 0 ? (
                        <table className="w-full border">
                          <thead>
                            <tr>
                              <th className="border p-2">SI No.</th>
                              <th className="border p-2">Name</th>
                              <th className="border p-2">Email</th>
                              <th className="border p-2">Phone</th>
                            </tr>
                          </thead>
                          <tbody>
                            {members.map((member, memberIndex) => (
                              <tr key={member._id}>
                                <td className="border p-2">
                                  {memberIndex + 1}
                                </td>
                                <td className="border p-2">{member.name}</td>
                                <td className="border p-2">
                                  {member.email || "N/A"}
                                </td>
                                <td className="border p-2">{member.phone}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="border p-2 text-center">
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
