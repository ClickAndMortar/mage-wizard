// @ts-ignore
import type { LocaleOptions, ToRelativeOptions } from 'luxon'
// @ts-ignore
import { DateTime } from 'luxon'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      luxon: (date: string | Date, format: string = 'yyyy-MM-dd', options?: ToRelativeOptions | LocaleOptions): string | null => {
        const dateTime = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date)

        if (format === 'relative') {
          return dateTime.toRelative(options)
        }

        return dateTime.toFormat(format, options)
      },
    },
  }
})
