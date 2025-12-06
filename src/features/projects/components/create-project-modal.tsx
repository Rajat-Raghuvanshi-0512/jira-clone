'use client'
import { ResponsiveModal } from '@/components/responsive-modal'
import { CreateWorkspaceForm } from './create-project-form'
import { useCreateProjectModal } from '../hooks/use-create-project-modal'

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal()
  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  )
}
