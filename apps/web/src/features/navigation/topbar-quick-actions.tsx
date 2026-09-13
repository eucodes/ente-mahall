"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  DropdownMenu,
  Plus,
  Users,
  UsersRound,
  Wallet,
  FileText,
  Megaphone,
  Calendar
} from "@mahalle/ui";

export function TopbarQuickActions({ slug }: { slug: string }) {
  const router = useRouter();

  const items = [
    {
      label: "Add Member",
      icon: <Users className="h-4 w-4 text-emerald-600" />,
      onClick: () => router.push(`/${slug}/members`)
    },
    {
      label: "Register Family",
      icon: <UsersRound className="h-4 w-4 text-sky-600" />,
      onClick: () => router.push(`/${slug}/families`)
    },
    {
      label: "Collect Due Payment",
      icon: <Wallet className="h-4 w-4 text-teal-600" />,
      onClick: () => router.push(`/${slug}/finance/dues`)
    },
    {
      label: "Record Voucher",
      icon: <FileText className="h-4 w-4 text-amber-600" />,
      onClick: () => router.push(`/${slug}/finance/vouchers`)
    },
    {
      label: "Official Register Entry",
      icon: <FileText className="h-4 w-4 text-indigo-600" />,
      onClick: () => router.push(`/${slug}/registers/marriage`)
    },
    {
      label: "Post Announcement",
      icon: <Megaphone className="h-4 w-4 text-violet-600" />,
      onClick: () => router.push(`/${slug}/announcements`)
    },
    {
      label: "Schedule Event / Meeting",
      icon: <Calendar className="h-4 w-4 text-rose-600" />,
      onClick: () => router.push(`/${slug}/events`)
    }
  ];

  return (
    <div className="relative z-40">
      <DropdownMenu
        trigger={
          <Button
            size="sm"
            className="gap-1.5 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs px-3.5"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New</span>
          </Button>
        }
        items={items}
        align="right"
      />
    </div>
  );
}
