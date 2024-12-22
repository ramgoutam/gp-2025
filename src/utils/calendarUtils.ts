export const snapToHalfHour = (hour: number, minutes: number) => {
  const roundedMinutes = Math.round(minutes / 30) * 30;
  
  let adjustedHour = hour;
  let adjustedMinutes = roundedMinutes;
  
  if (roundedMinutes === 60) {
    adjustedHour += 1;
    adjustedMinutes = 0;
  }
  
  return {
    hour: adjustedHour,
    minutes: adjustedMinutes
  };
};

export const formatTime = (hour: number, minutes: number) => {
  return `${hour}:${minutes.toString().padStart(2, '0')}`;
};

export const calculatePosition = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const baseHour = 6; // Calendar starts at 6 AM
  return ((hours - baseHour) * 64) + ((minutes / 60) * 64);
};

export const calculateHeight = (startTime: string, endTime: string) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Calculate total minutes for both times
  const totalStartMinutes = (startHours * 60) + startMinutes;
  const totalEndMinutes = (endHours * 60) + endMinutes;
  
  // Calculate the difference in minutes
  const diffInMinutes = totalEndMinutes - totalStartMinutes;
  
  // Convert minutes to pixels (64px per hour)
  return Math.max((diffInMinutes / 60) * 64, 32); // Minimum height of 32px
};