  export const getDaysInMonth = (currentYear: number, currentMonth: number) => {
    return new Date(currentYear, currentMonth, 0).getDate()
  }

  export const getFirstDayOfMonth = (currentYear: number, currentMonth: number) => {
    return new Date(currentYear, currentMonth - 1, 1).getDay()
  }