"use client"

import Link from "next/link"
import { UserNav } from "@/components/layout/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { AddTransactionDialog } from "@/components/dialogs/add-transaction-dialog"

export function MainNav() {
  return (
    <div className="flex h-16 items-center px-4 border-b">
      <div className="ml-auto flex items-center space-x-4">
        <AddTransactionDialog />
        <ThemeToggle />
        <UserNav />
      </div>
    </div>
  )
}