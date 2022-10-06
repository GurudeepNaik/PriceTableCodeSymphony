export const getOverlap = (a: any, b: any) => {
    const a_endTime = new Date(a.endTime);
    const b_endTime = new Date(b.endTime);
    const a_startTime = new Date(a.startTime);
    const b_startTime = new Date(b.startTime);
    return Math.max(
      0,
      Math.min(a_endTime.getTime(), b_endTime.getTime()) -
        Math.max(a_startTime.getTime(), b_startTime.getTime())
    );
  };
