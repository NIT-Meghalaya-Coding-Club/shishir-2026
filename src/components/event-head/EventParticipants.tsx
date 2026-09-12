"use client";

import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { Download, Loader2, RefreshCw, Users, X } from "lucide-react";
import { toast } from "react-toastify";

type TeamMember = {
  name?: string;
  collegeID?: string;
  phone?: string;
  email?: string;
};

type Registration = {
  userId: string;
  teamData: TeamMember[];
  leader?: TeamMember | null;
  metadata?: {
    dynamicEventType?: string;
    groupName?: string;
  };
};

type EventParticipantsProps = {
  eventCode: string;
  eventName: string;
  onClose: () => void;
};

function getRows(registrations: Registration[]) {
  return registrations.map((registration, index) => {
    const leader = registration.leader || registration.teamData?.[0] || {};
    const members = registration.teamData?.slice(1) || [];

    return {
      "Sl No.": index + 1,
      "Leader Name": leader.name || "N/A",
      "Leader Roll No.": leader.collegeID || "N/A",
      "Leader Email": registration.userId,
      "Leader Phone": leader.phone || "N/A",
      "Team Members": members
        .map(
          (member, memberIndex) =>
            `${memberIndex + 1}. ${member.name || "N/A"} (${member.collegeID || "N/A"}, ${member.phone || "N/A"})`
        )
        .join(", "),
      "Event Type": registration.metadata?.dynamicEventType || "N/A",
      "Group Name": registration.metadata?.groupName || "N/A",
    };
  });
}

export default function EventParticipants({
  eventCode,
  eventName,
  onClose,
}: EventParticipantsProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/event-head/registrations/${eventCode}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Could not load participants");
        return;
      }

      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Load participants failed:", error);
      toast.error("Could not load participants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [eventCode]);

  const exportParticipants = async () => {
    try {
      setExporting(true);
      const rows = getRows(registrations);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Participants");
      worksheet.columns = Object.keys(rows[0] || {}).map((header) => ({
        header,
        key: header,
        width: Math.max(header.length + 2, 15),
      }));
      worksheet.addRows(rows);

      const buffer = await workbook.xlsx.writeBuffer();
      const downloadUrl = URL.createObjectURL(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `participants_${eventCode}.xlsx`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export participants failed:", error);
      toast.error("Could not export participants");
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="mt-4 min-w-0 max-w-full overflow-hidden border border-amber-400/30 bg-zinc-950/70 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-300">Participants</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{eventName}</h3>
          <p className="mt-1 text-sm text-zinc-400">{registrations.length} registration(s)</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={loadParticipants} disabled={loading} className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10 disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button type="button" onClick={exportParticipants} disabled={loading || exporting || registrations.length === 0} className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-60">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Excel
          </button>
          <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-zinc-300 hover:bg-white/10" title="Close participants">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-zinc-400"><Loader2 className="h-4 w-4 animate-spin" />Loading participants</div>
      ) : registrations.length === 0 ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-zinc-500"><Users className="h-4 w-4" />No registrations yet.</p>
      ) : (
        <div className="mt-4 max-w-full overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
              <tr><th className="px-3 py-2">Leader</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Phone</th><th className="px-3 py-2">Members</th><th className="px-3 py-2">Group</th></tr>
            </thead>
            <tbody>
              {registrations.map((registration, index) => {
                const leader = registration.leader || registration.teamData?.[0] || {};
                return <tr key={`${registration.userId}-${index}`} className="border-b border-white/5 text-zinc-300"><td className="px-3 py-3">{leader.name || "N/A"}<span className="block text-xs text-zinc-500">{leader.collegeID || "N/A"}</span></td><td className="px-3 py-3">{registration.userId}</td><td className="px-3 py-3">{leader.phone || "N/A"}</td><td className="px-3 py-3">{registration.teamData?.length || 0}</td><td className="px-3 py-3">{registration.metadata?.groupName || "N/A"}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}