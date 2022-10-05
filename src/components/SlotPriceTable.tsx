import { useState, useEffect } from "react";
import axios from 'axios'
import './style.css'
import { Link } from "react-router-dom";
const SlotPriceTable = () => {
  const rows: {
    id: number,
    amount: number,
    created_at: string,
    updated_at: string,
    startTime: string,
    endTime: string
  }[] = [];
  const [tableData, setTableData] = useState(rows);
  const [postData, setPostData] = useState({
    id: 0,
    amount: 0,
    startTime: "",
    endTime: ""
  });
  const [isUpdateFlag, setIsUpdateFlag] = useState(false);
  const getOverlap = (a: any, b: any) => {
    const a_endTime = new Date(a.endTime)
    const b_endTime = new Date(b.endTime)
    const a_startTime = new Date(a.startTime)
    const b_startTime = new Date(b.startTime)
    return Math.max(0, Math.min(a_endTime.getTime(), b_endTime.getTime()) - Math.max(a_startTime.getTime(), b_startTime.getTime()));
  }

  const getBasePriceTable = async () => {
    fetch("http://localhost:8080/slotPrice")
      .then((res: any) => res.json())
      .then((res: any) => {
        let data = res.message.sort((a: any, b: any) => {
          return +new Date(a.startTime) - +new Date(b.startTime);
        });
        console.log(data)
        setTableData(data)
      })
      .catch((err: any) => console.log(err))
  };
  useEffect(() => {
    getBasePriceTable()
  }, [])



  const handleChangeHandler = (e: any) => {
    setPostData((pre) => ({ ...pre, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    let num = 0;
    tableData.map((data) => {
      return num = num + getOverlap(postData, data)
    })
    console.log(num)
    if (num === 0) {
      if (!isUpdateFlag) {
        try {
          await axios.post(`http://localhost:8080/slotPrice`, postData)
          console.log(postData)
          setPostData({
            id: 0,
            amount: 0,
            startTime: "",
            endTime: ""
          });
          getBasePriceTable()
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await axios.patch(`http://localhost:8080/slotPrice/${postData.id}`, { amount: postData.amount, startTime: postData.startTime, endTime: postData.endTime })
          getBasePriceTable()
          setPostData({
            id: 0,
            amount: 0,
            startTime: "",
            endTime: ""
          });
          setIsUpdateFlag(false)
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      window.alert("Please Add Unoverlaped Start and End Time")
    }
  };
  const handleDelete = async (item: any) => {
    try {
      await axios.delete(`http://localhost:8080/slotPrice/${item.id}`)
      let array = tableData
      array = array.filter((itemObj: any) => itemObj.id !== item.id)
      setTableData(array)
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = (data: any) => {
    console.log(data)
    data.startTime = data.startTime.split(":00.000Z")[0]
    data.endTime = data.endTime.split(":00.000Z")[0]
    setPostData(data)
    setIsUpdateFlag(true)
  }
  return (
    <div className="basePriceContainer">
      <h1 className="h1header basePrice">Slot Price</h1>
      <form className="form-slotPrice form-basePrice" onSubmit={handleSubmit}>
        <div>
          <label>START TIME</label>
          <input type="datetime-local" value={postData.startTime} name="startTime" onChange={(e) => handleChangeHandler(e)} />
        </div>
        <div>
          <label>END TIME</label>
          <input type="datetime-local" value={postData.endTime} name="endTime" onChange={(e) => handleChangeHandler(e)} />
        </div>
        <div>
          <label>Amount</label>
          <input type="number" value={postData.amount} name="amount" onChange={(e) => handleChangeHandler(e)} />
        </div>
        <div>
          <button className="submitbtn" type="submit">{isUpdateFlag ? ("SAVE") : ("SUBMIT")}</button>
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
            {tableData.length > 0 ?
              tableData.map((data, i) => {
                return <tr key={i}>
                  <th>{data.id}</th>
                  <th>{data.startTime.split("T")[0]} {data.startTime.split("T")[1].split(":00.000Z")[0]}</th>
                  <th>{data.endTime.split("T")[0]} {data.endTime.split("T")[1].split(":00.000Z")[0]}</th>
                  <th>{data.created_at.split("T")[0]} {data.created_at.split("T")[1].split(".000Z")[0]}</th>
                  <th>{data.updated_at.split("T")[0]} {data.updated_at.split("T")[1].split(".000Z")[0]}</th>
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
              })
              : (<tr><th>Loading...</th></tr>)}
          </tbody>
        </table>
      </div>
      <Link to='/basePrice' className="slot" >Base Price</Link>
    </div>
  );
};

export default SlotPriceTable;
