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
  const pixelsPerHour = 64;
  return ((hours - baseHour) * pixelsPerHour) + ((minutes / 60) * pixelsPerHour);
};

export const calculateHeight = (startTime: string, endTime: string) => {
  console.log('Calculating height for:', { startTime, endTime });
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Convert both times to minutes since midnight
  const startTotalMinutes = (startHours * 60) + startMinutes;
  const endTotalMinutes = (endHours * 60) + endMinutes;
  
  // Calculate the difference in minutes
  const diffInMinutes = endTotalMinutes - startTotalMinutes;
  
  // Convert to pixels (64px per hour = 64/60 pixels per minute)
  const heightInPixels = (diffInMinutes * (64/60));
  
  console.log('Height calculation:', {
    startTotalMinutes,
    endTotalMinutes,
    diffInMinutes,
    heightInPixels
  });
  
  // Return the calculated height, with a minimum of 32px
  return Math.max(heightInPixels, 32);
};