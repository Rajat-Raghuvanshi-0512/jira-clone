'use client'

import { cn } from '@/lib/utils'
import { Button } from './button'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}
export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Select a date',
  className,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            'w-full justify-start text-left font-normal px-3',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4 mr-2" />
          {value ? format(value, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col">
        <Calendar
          autoFocus
          mode="single"
          selected={value}
          onSelect={(date) => onChange(date as Date)}
        />
        <Button
          variant="outline"
          size="sm"
          className="px-3 w-fit ml-auto mr-2 mb-2"
          onClick={() => onChange(undefined)}
        >
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  )
}
