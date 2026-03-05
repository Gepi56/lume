import ProfilesGrid from "@/components/explore/ProfilesGrid";

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <ProfilesGrid
        title="Profili del momento"
        subtitle="Social reputazionale privato. Pulito, discreto, premium."
        limit={12}
      />
    </div>
  );
}