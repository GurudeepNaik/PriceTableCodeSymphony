/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { Link } from "react-router-dom";
const SlotPriceTable = () => {
  const rows: {
    id: number;
    amount: number;
    create_at: string;
    update_at: string;
    startTime: string;
    endTime: string;
  }[] = [];
  const [tableData, setTableData] = useState(rows);
  const [postData, setPostData] = useState({
    id: 0,
    amount: 0,
    startTime: "",
    endTime: "",
  });
  const [isUpdateFlag, setIsUpdateFlag] = useState(false);
  const getOverlap = (a: any, b: any) => {
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

  const getBasePriceTable = async () => {
    fetch("http://localhost:7000/slotsPrice?date=2022-08-09")
      .then((res: any) => res.json())
      .then((res: any) => {
        let data = res.slotePrice.sort((a: any, b: any) => {
          return +new Date(a.startTime) - +new Date(b.startTime);
        });
        let newdata = data.map((each: any) => {
          return {
            ...each,
            startTime: new Date(each.startTime).toLocaleString(),
            endTime: new Date(each.endTime).toLocaleString(),
            create_at: new Date(each.create_at).toLocaleString(),
            update_at: new Date(each.update_at).toLocaleString(),
          };
        });
        setTableData(newdata);
      })
      .catch((err: any) => console.log(err));
  };
  useEffect(() => {
    getBasePriceTable();
  }, []);

  const handleChangeHandler = (e: any) => {
    setPostData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let num = 0;
    tableData.map((data) => {
      if (data.id !== postData.id) {
        return (num = num + getOverlap(postData, data));
      }
    });
    if (num === 0) {
      if (!isUpdateFlag) {
        try {
          await axios.post(`http://localhost:7000/newSlotPrice`, {
            ...postData,
            startTime: new Date(postData.startTime).toISOString(),
            endTime: new Date(postData.endTime).toISOString(),
          });
          setPostData({
            id: 0,
            amount: 0,
            startTime: "",
            endTime: "",
          });
          getBasePriceTable();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await axios.put(`http://localhost:7000/slotPrice/${postData.id}`, {
            amount: postData.amount,
            startTime: new Date(postData.startTime).toISOString(),
            endTime: new Date(postData.endTime).toISOString(),
          });
          getBasePriceTable();
          setPostData({
            id: 0,
            amount: 0,
            startTime: "",
            endTime: "",
          });
          setIsUpdateFlag(false);
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
      await axios.delete(`http://localhost:7000/slotPrice/${item.id}`);
      let array = tableData;
      array = array.filter((itemObj: any) => itemObj.id !== item.id);
      setTableData(array);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = (data: any) => {
    console.log(data.startTime, data.endTime);
    data.startTime = new Date(data.startTime)
      .toISOString()
      .split(":00.000Z")[0];
    data.endTime = new Date(data.endTime).toISOString().split(":00.000Z")[0];
    setPostData(data);
    setIsUpdateFlag(true);
  };
  return (
    <div className="basePriceContainer">
      <h1 className="h1header basePrice">Slot Price</h1>
      <form className="form-slotPrice form-basePrice" onSubmit={handleSubmit}>
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
          <button className="submitbtn" type="submit">
            {isUpdateFlag ? "SAVE" : "SUBMIT"}
          </button>
        </div>
      </form>
      <div>
        <table className="tbl styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>START TIME</th>
              <th>END TIME</th>
              <th>CREATED AT</th>
              <th>UPDATED AT</th>
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
                    <th>{data.startTime}</th>
                    <th>{data.endTime}</th>
                    <th>{data.create_at}</th>
                    <th>{data.update_at}</th>
                    <th>{data.amount}</th>
                    <th>
                      <button
                        className="btn updt"
                        onClick={() => handleUpdate(data)}
                      >
                        UPDATE
                      </button>
                      &nbsp; &nbsp; &nbsp;
                      <button
                        className="btn dngr"
                        onClick={() => handleDelete(data)}
                      >
                        DELETE
                      </button>
                    </th>
                  </tr>
                );
              })
            ) : (
              <tr>
                <th>Loading...</th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Link to="/basePrice" className="slot">
        Base Price
      </Link>
    </div>
  );
};

export default SlotPriceTable;
