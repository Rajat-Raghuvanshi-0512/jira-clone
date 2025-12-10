'use client'
import { ResponsiveModal } from '@/components/responsive-modal'
import { useEditTaskModal } from '../hooks/use-edit-task-modal'
import { EditTaskFormWrapper } from './edit-task-form-wrapper'

export const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal()
  return (
    <ResponsiveModal isOpen={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper taskId={taskId} onCancel={close} />}
    </ResponsiveModal>
  )
}
