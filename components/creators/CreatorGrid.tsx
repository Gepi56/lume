import CreatorCard from "./CreatorCard";
import { DEMO_CREATORS } from "@/lib/demo/creators";

export default function CreatorGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {DEMO_CREATORS.map((c) => (
        <CreatorCard key={c.id} model={c} />
      ))}
    </div>
  );
}