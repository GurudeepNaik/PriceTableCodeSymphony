const getTimeInMilliSeconds = (a:any) => {
    let timeArr = a.split(':');
    let milliSeconds = ((+timeArr[0]) * 60 * 60 + (+timeArr[1]) * 60) * 1000; 
    return milliSeconds;
};

const getOverlap = (a:any, b:any) => {

    return Math.max(0, Math.min(a.toTime, b.toTime) - Math.max(a.fromTime, b.fromTime));
};
  

const getIsOverlapBasePrice = (tableData: any, payload: any) => {
    
    let isDefaultRowExist = false;
    let indexOfDefaultRow = -1;
    const { fromTime, toTime, id } = payload;


    for (let i = 0; i < tableData.length; i++) {
        
        if (!tableData[i].fromTime && !tableData.toTime) {
          isDefaultRowExist = true;
          indexOfDefaultRow = i;

        }
    }
  
    if (fromTime && toTime && (getTimeInMilliSeconds(toTime) > getTimeInMilliSeconds(fromTime))) {
  
        let currentSlot = { fromTime: getTimeInMilliSeconds(fromTime), toTime: getTimeInMilliSeconds(toTime) };
  
        for (let i = 0; i < tableData.length; i++) {
  
          if(i !== indexOfDefaultRow && tableData[i].id !== id) {
  
            let currentBookedSlot = {
              fromTime: new Date(tableData[i].fromTime).getTime(),
              toTime: new Date(tableData[i].toTime).getTime()
            };
            
            if (getOverlap(currentSlot, currentBookedSlot) > 0) {
                alert("Time slot overlapped");
                return true;
            }
  
          }
          
        }
        return false;

    } else if(fromTime === "" && toTime === "" && id) {
        return false;

    } else if(!isDefaultRowExist && fromTime === "" && toTime === "") {
        return false;
        
    } else {
    
        alert("Time entered are incorrect or Default row already present ");

    }

};

export { getIsOverlapBasePrice };