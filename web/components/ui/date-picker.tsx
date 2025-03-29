import React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ date, setDate }) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      if (date) {
        newDate.setHours(date.getHours(), date.getMinutes())
      }
      setDate(newDate)
    } else {
      setDate(undefined)
    }
  }

  const handleHourChange = (hour: string) => {
    const newDate = new Date(date || new Date())
    newDate.setHours(parseInt(hour), newDate.getMinutes())
    setDate(newDate)
  }

  const handleMinuteChange = (minute: string) => {
    const newDate = new Date(date || new Date())
    newDate.setMinutes(parseInt(minute))
    setDate(newDate)
  }

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP HH:mm') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between">
            <Select
              value={date ? date.getHours().toString() : ''}
              onValueChange={handleHourChange}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={date ? date.getMinutes().toString() : ''}
              onValueChange={handleMinuteChange}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DateTimePicker }