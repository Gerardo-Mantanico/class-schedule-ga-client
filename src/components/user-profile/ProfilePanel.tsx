import UserInfoPsmCard from "@/components/user-profile/UserInfoPsmCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";

interface ProfilePanelProps {
  title?: string;
  showPsmCard?: boolean;
}

export default function ProfilePanel({ title = "Profile", showPsmCard = false }: Readonly<ProfilePanelProps>) {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">{title}</h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          {showPsmCard ? <UserInfoPsmCard /> : null}
        </div>
      </div>
    </div>
  );
}
