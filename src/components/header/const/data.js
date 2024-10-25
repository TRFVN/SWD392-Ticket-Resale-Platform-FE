import {
  Activity,
  Archive,
  LayoutGrid,
  Music,
  Ticket,
  Users,
} from "lucide-react";

export const recentSearches = [
  "Taylor Swift Concert",
  "NBA Games",
  "Broadway Shows",
  "Local Events",
];

export const trendingSearches = [
  { text: "Summer Festival 2024", trend: "↑ 120%" },
  { text: "World Tour Concert", trend: "↑ 85%" },
  { text: "Comedy Night Special", trend: "↑ 45%" },
];

export const categories = [
  { id: "all", label: "All Events", icon: LayoutGrid },
  { id: "music", label: "Music", icon: Music },
  { id: "sports", label: "Sports", icon: Activity },
  { id: "arts", label: "Arts & Theatre", icon: Ticket },
  { id: "family", label: "Family", icon: Users },
  { id: "more", label: "More", icon: Archive },
];
