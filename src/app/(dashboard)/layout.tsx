import React from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { CreateProjectModal } from '@/features/projects/components/create-project-modal'
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal'
import { CreateTaskModal } from '@/features/tasks/components/create-task-modal'
import { EditTaskModal } from '@/features/tasks/components/edit-task-modal'
interface DashboardLayoutProps {
  children: React.ReactNode
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <div className="w-full h-full flex">
        <div className="fixed left-0 top-0 hidden lg:block w-64 h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-64 w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
