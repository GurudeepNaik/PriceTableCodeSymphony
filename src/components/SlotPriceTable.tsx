/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { Link } from "react-router-dom";
import { getOverlap, getIsMinuteZero, extractToFromTimes } from "../utils/getIsOverlap";
import moment from "moment";
import { baseUrl } from "../constants/url";

const SlotPriceTable = () => {
  //for getting Table data
  const rows: {
    id: number;
    amount: number;
    startTime: string;
    endTime: string;
  }[] = [];

  //initial values for post Data
  const initialPostValue = { id: 0, amount: 0, startTime: "", endTime: "" };

  const [tableData, setTableData] = useState(rows);
  const [postData, setPostData] = useState(initialPostValue);
  const [isUpdateFlag, setIsUpdateFlag] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [slotDateFlag, setSlotDateFlag] = useState(false);


  const getSlotPriceTable = async () => {
    fetch(`${baseUrl}/slotsPrice?date=${slotDate}`)
      .then((res: any) => res.json())
      .then((res: any) => {
        let data = res.slotePrice.sort(
          (a: any, b: any) => +new Date(a.startTime) - +new Date(b.startTime)
        );
        setTableData(data);
      })
      .catch((err: any) => console.log(err));
  };


  useEffect(() => {
    slotDateFlag && getSlotPriceTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotDateFlag, slotDate]);


  const handleChangeHandler = (e: any) => {
    setPostData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };


  const handleSubmit = async (e: any) => {

    e.preventDefault();
    let num = 0;
    tableData.map((data) => {
      if (data.id !== postData.id) {
        return (num = num + getOverlap(extractToFromTimes(postData), extractToFromTimes(data)));
      }
    });

    if (num === 0) {
      //For Posting Data
      if (!isUpdateFlag) {
        try {
          const toTime = postData.startTime;
          const fromTime = postData.endTime;
          const isMinuteZero = getIsMinuteZero({ fromTime, toTime });

          if (isMinuteZero) {
            await axios.post(`${baseUrl}/newSlotPrice`, {
              ...postData,
              startTime: new Date(postData.startTime).toISOString(),
              endTime: new Date(postData.endTime).toISOString(),
            });
            getSlotPriceTable();

          } else {
            window.alert("Please Add Time In Hours");

          }
          setPostData(initialPostValue);

        } catch (error) {
          console.log(error);
        }
      } else {
        //for Updating Data
        try {

          const toTime = postData.startTime;
          const fromTime = postData.endTime;
          const isMinuteZero = getIsMinuteZero({ fromTime, toTime });

          if (isMinuteZero) {
            await axios.put(`${baseUrl}/slotPrice/${postData.id}`, {
              amount: postData.amount,
              startTime: new Date(postData.startTime).toISOString(),
              endTime: new Date(postData.endTime).toISOString(),
            });

            getSlotPriceTable();
          
          } else {
            window.alert("Please Add Time In Hours");
          }
          
          setIsUpdateFlag(false);
          setPostData(initialPostValue);
        
        } catch (error) {
          console.log(error);
        }
      }
    
    } else {
      window.alert("Please Add Unoverlaped Start and End Time");
    }
  };

  const handleDelete = async (item: any) => {
    try {
      await axios.delete(`${baseUrl}/slotPrice/${item.id}`);
      let array = tableData;
      array = array.filter((itemObj: any) => itemObj.id !== item.id);
      setTableData(array);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (data: any) => {
    data.startTime = moment(data.startTime).format("YYYY-MM-DDTkk:mm");
    data.endTime = moment(data.endTime).format("YYYY-MM-DDTkk:mm");
    setPostData(data);
    setIsUpdateFlag(true);
  };

  const handleSubmitDate = () => {
    if (slotDate === "") {
      window.alert("Please Add Date");
    } else {
      setSlotDateFlag(true);
    }
  };

  return (
    <div className="basePriceContainer">
      <h1 className="h1header basePrice">Slot Price</h1>
      <div className="sloteDate">
        <h2>Slot Date:</h2>
        <input
          type="date"
          value={slotDate}
          name="slotDate"
          onChange={(e) => setSlotDate(e.target.value)}
        />
        <button onClick={() => handleSubmitDate()}>Slots</button>
      </div>
      {slotDateFlag ? (
        <>
          <form
            className="form-slotPrice form-basePrice"
            onSubmit={handleSubmit}
          >
            <div>
              <label>START TIME</label>
              <input
                type="datetime-local"
                value={postData.startTime}
                name="startTime"
                onChange={(e) => handleChangeHandler(e)}
              />
            </div>
            <div>
              <label>END TIME</label>
              <input
                type="datetime-local"
                value={postData.endTime}
                name="endTime"
                onChange={(e) => handleChangeHandler(e)}
              />
            </div>
            <div>
              <label>Amount</label>
              <input
                type="number"
                value={postData.amount}
                name="amount"
                onChange={(e) => handleChangeHandler(e)}
              />
            </div>
            <div>
              <button className="submitbtn" type="submit"> { isUpdateFlag ? "SAVE" : "SUBMIT" } </button>
            </div>
          </form>
          <div>
            <table className="tbl styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>START TIME</th>
                  <th>END TIME</th>
                  <th>AMOUNT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((data, i) => {
                    return (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <th>{new Date(data.startTime).toLocaleString()}</th>
                        <th>{new Date(data.endTime).toLocaleString()}</th>
                        <th>{data.amount}</th>
                        <th>
                          <button className="btn updt" onClick={() => handleUpdate(data)}> UPDATE </button>
                          &nbsp; &nbsp; &nbsp;
                          <button className="btn dngr" onClick={() => handleDelete(data)}> DELETE </button>
                        </th>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <th className="loader">No Slots Available On this Day</th>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h2 className="loader2">Please Search Slots By Date</h2>
      )}

      <Link to="/basePrice" className="slot"> Base Price </Link>
    </div>
  );
};

export default SlotPriceTable;
