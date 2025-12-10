import { useQueryState, parseAsString } from 'nuqs'

export const useEditTaskModal = () => {
  const [taskId, setTaskId] = useQueryState(
    'edit-task',
    parseAsString.withDefault(''),
  )
  const open = (taskId: string) => setTaskId(taskId)
  const close = () => setTaskId(null)

  return { taskId, open, close, setTaskId }
}
