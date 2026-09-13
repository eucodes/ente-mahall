"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, ShieldCheck, Users, cn } from "@mahalle/ui";
import type { PlatformUser, StatewideUser } from "@/lib/platform";
import { PlatformUsersTable } from "./platform-users-table";
import { StatewideUsersTable } from "./statewide-users-table";

interface UsersWorkspaceProps {
  platformUsers: PlatformUser[];
  allUsers: StatewideUser[];
}

export function UsersWorkspace({ platformUsers, allUsers }: UsersWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"statewide" | "staff">("statewide");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-center gap-1.5 border-b border-border/80 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("statewide")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 cursor-pointer",
            activeTab === "statewide"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Users className="h-3.5 w-3.5" />
          <span>All Registered Users ({allUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 cursor-pointer",
            activeTab === "staff"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Platform Staff &amp; Root Access ({platformUsers.length})</span>
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "statewide" ? (
        <StatewideUsersTable users={allUsers} />
      ) : (
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardHeader className="border-b border-border/60 pb-3">
            <CardTitle className="text-sm font-bold">Control Plane Administrators</CardTitle>
            <p className="text-xs text-muted-foreground">
              Accounts authorized to access the level-0 platform command center.
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <PlatformUsersTable users={platformUsers} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
