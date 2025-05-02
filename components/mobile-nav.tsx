"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Plus, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getGroups } from "@/lib/groups";

export function MobileNav() {
  const pathname = usePathname();
  const [favoriteGroupId, setFavoriteGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteGroup = async () => {
      try {
        const groups = await getGroups();
        const favorite = groups.find((group) => group.favorite);
        if (favorite) {
          setFavoriteGroupId(favorite.id);
        }
      } catch (error) {
        console.error("Failed to fetch favorite group:", error);
      }
    };

    fetchFavoriteGroup();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5">
        <Link
          href="/"
          className={cn(
            "group inline-flex flex-col items-center justify-center px-5 py-2",
            pathname === "/" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="mb-1 h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/groups"
          className={cn(
            "group inline-flex flex-col items-center justify-center px-5 py-2",
            pathname === "/groups" || pathname?.startsWith("/groups/")
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Users className="mb-1 h-5 w-5" />
          <span className="text-xs">Groups</span>
        </Link>
        <Link
          href={
            favoriteGroupId ? `/groups/${favoriteGroupId}/expenses/new` : "/"
          }
          className="group inline-flex flex-col items-center justify-center px-5 py-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Plus className="h-6 w-6 text-primary-foreground" />
          </div>
        </Link>
        <Link
          href="/invitations"
          className={cn(
            "group inline-flex flex-col items-center justify-center px-5 py-2",
            pathname?.startsWith("/invitations")
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Bell className="mb-1 h-5 w-5" />
          <span className="text-xs">Invites</span>
        </Link>
        <Link
          href="/profile"
          className={cn(
            "group inline-flex flex-col items-center justify-center px-5 py-2",
            pathname?.startsWith("/profile")
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <User className="mb-1 h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
}
