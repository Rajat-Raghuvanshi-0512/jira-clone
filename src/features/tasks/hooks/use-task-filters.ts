import { useQueryStates, parseAsString } from 'nuqs'

export const useTaskFilters = () => {
  return useQueryStates({
    statusId: parseAsString,
    search: parseAsString.withDefault(''),
    dueDate: parseAsString,
    assigneeId: parseAsString,
  })
}
