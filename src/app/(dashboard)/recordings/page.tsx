"use client";

import { useState, useMemo } from "react";
import {
  Download,
  EllipsisVertical,
  Search,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AudioPlayer } from "@/components/recordings/audio-player";
import { recordings, type RecordingStatus } from "@/data/recordings";

const PAGE_SIZE = 10;

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function statusBadgeVariant(status: RecordingStatus) {
  switch (status) {
    case "completed":
      return "default" as const;
    case "failed":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function escapeCSVField(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export default function RecordingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
  const [agentFilter, setAgentFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  const agents = useMemo(
    () => [...new Set(recordings.map((r) => r.agent))],
    [],
  );
  const campaignNames = useMemo(
    () => [...new Set(recordings.map((r) => r.campaign))],
    [],
  );
  const allTags = useMemo(
    () => [...new Set(recordings.flatMap((r) => r.tags))].filter(Boolean),
    [],
  );
  const statuses = useMemo(
    () => [...new Set(recordings.map((r) => r.status))],
    [],
  );

  const filtered = useMemo(() => {
    return recordings.filter((r) => {
      const q = search.toLowerCase();
      if (
        q &&
        !r.contactName.toLowerCase().includes(q) &&
        !r.agent.toLowerCase().includes(q) &&
        !r.campaign.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (agentFilter !== "all" && r.agent !== agentFilter) return false;
      if (campaignFilter !== "all" && r.campaign !== campaignFilter) return false;
      if (tagFilter !== "all" && !r.tags.includes(tagFilter)) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (durationFilter !== "all") {
        if (durationFilter === "under30" && r.durationSeconds >= 30) return false;
        if (durationFilter === "under60" && r.durationSeconds >= 60) return false;
        if (durationFilter === "under300" && r.durationSeconds >= 300) return false;
      }
      return true;
    });
  }, [search, agentFilter, campaignFilter, tagFilter, statusFilter, durationFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const resetPage = () => setPage(1);

  const handleExport = () => {
    const headers = [
      "Contact Name",
      "Phone",
      "Duration",
      "Agent",
      "Campaign",
      "Date",
      "Tags",
      "Status",
      "Model",
    ];
    const rows = filtered.map((r) => [
      escapeCSVField(r.contactName),
      escapeCSVField(r.contactPhone),
      formatDuration(r.durationSeconds),
      escapeCSVField(r.agent),
      escapeCSVField(r.campaign),
      r.date,
      escapeCSVField(r.tags.join(", ")),
      r.status,
      r.model,
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recordings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recordings</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recordings..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>

        <Select
          value={agentFilter}
          onValueChange={(v) => {
            setAgentFilter(v);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            {agents.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={campaignFilter}
          onValueChange={(v) => {
            setCampaignFilter(v);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaignNames.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={tagFilter}
          onValueChange={(v) => {
            setTagFilter(v);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={durationFilter}
          onValueChange={(v) => {
            setDurationFilter(v);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Durations</SelectItem>
            <SelectItem value="under30">Under 30s</SelectItem>
            <SelectItem value="under60">Under 1 min</SelectItem>
            <SelectItem value="under300">Under 5 min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Listen</TableHead>
              <TableHead className="min-w-[180px]">Contact</TableHead>
              <TableHead>Minutes</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Model</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((recording) => (
              <TableRow key={recording.id}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <AudioPlayer
                    audioUrl={recording.audioUrl}
                    isPlaying={playingRecordingId === recording.id}
                    onPlay={() => setPlayingRecordingId(recording.id)}
                    onPause={() => setPlayingRecordingId(null)}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{recording.contactName}</div>
                  <div className="text-xs text-muted-foreground">
                    {recording.contactPhone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDuration(recording.durationSeconds)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{recording.agent}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{recording.campaign}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{recording.date}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {recording.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant(recording.status)}>
                    {recording.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{recording.model}</div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
