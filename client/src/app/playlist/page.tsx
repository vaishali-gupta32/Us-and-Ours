"use client";
import GenericListPage from "@/components/GenericListPage";
import { Music } from "lucide-react";

export default function PlaylistPage() {
    return <GenericListPage type="song" title="Our Playlist" icon={Music} />;
}
