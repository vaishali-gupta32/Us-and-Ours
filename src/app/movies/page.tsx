"use client";
import GenericListPage from "@/components/GenericListPage";
import { Film } from "lucide-react";

export default function MoviesPage() {
    return <GenericListPage type="movie" title="Movies to Watch" icon={Film} />;
}
