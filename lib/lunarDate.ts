import { Lunar } from 'lunar-javascript'

export const getLunarDate = (date: Date): string => {
  const lunar = Lunar.fromDate(date)
  const day = lunar.getDay()
  const month = lunar.getMonth()
  const year = lunar.getYear()
  
  // Format: "15/1 Âm lịch" (keep it simple for header)
  return `${day}/${month} Âm lịch`
}
