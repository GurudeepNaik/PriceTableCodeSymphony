import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import { Link } from "react-router-dom";

const BasePriceTable = () => {
  const rows: {
    id: number;
    amount: number;
    created_at: string;
    updated_at: string;
  }[] = [];

  const [tableData, setTableData] = useState(rows);
  const [basePriceForm, setBasePriceForm] = useState({
    amount: 0,
    fromTime: "",
    toTime: "",
  });
  const [isUpdateFlag, setIsUpdateFlag] = useState(false);
  const [updateItemId, setUpdateItemId] = useState(-1);

  const getBasePriceTable = () => {
    fetch("http://localhost:7000/slotsPrice?date=2022-08-09")
      .then((res: any) => res.json())
      .then((res: any) => setTableData(res.basePrice))
      .catch((err: any) => console.log(err));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isUpdateFlag) {
      try {
        await axios.post(`http://localhost:7000/basePrice`, basePriceForm);
        setBasePriceForm({ amount: 0, fromTime: "", toTime: "" });
        getBasePriceTable();
      } catch (error) {
        console.log(error);
      }

    } else {
      
      try {
        await axios.put(`http://localhost:7000/editBasePrice/${updateItemId}`, basePriceForm);
        getBasePriceTable();
        setBasePriceForm({ amount: 0, fromTime: "", toTime: "" });
        setIsUpdateFlag(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getBasePriceTable();
  }, []);
  
  
  const handleUpdate = async (item: any) => {
    if(item.fromTime && item.toTime) {
      setBasePriceForm((prev)=>({ ...prev, amount: item.amount,
        fromTime: new Date(item.fromTime).toUTCString().split(" ")[4],
        toTime: new Date(item.toTime).toUTCString().split(" ")[4] 
      }));

    } else {

      setBasePriceForm((prev)=>({ ...prev, amount: item.amount, fromTime:"", toTime: "" }));
    }

    setIsUpdateFlag(true);
    setUpdateItemId(item.id);
  };

  const handleDelete = async (item: any) => {
    try {
      await axios.delete(`http://localhost:7000/basePrice/${item.id}`);
      let array = tableData;
      array = array.filter((itemObj: any) => itemObj.id !== item.id);
      setTableData(array);
      setIsUpdateFlag(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeHandler = (e: any) => {
    setBasePriceForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="basePriceContainer">
      <h1 className="h1header basePrice">Base Price</h1>
      <form className="form-basePrice" onSubmit={handleSubmit}>
        <label>Amount</label>
        <input
          type="number"
          value={basePriceForm.amount}
          name="amount"
          onChange={(e) => handleChangeHandler(e)}
        />
        <label>From Time</label>
        <input
          type="time"
          value={basePriceForm.fromTime}
          name="fromTime"
          onChange={(e) => handleChangeHandler(e)}
        />
        <label>To Time</label>
        <input
          type="time"
          value={basePriceForm.toTime}
          name="toTime"
          onChange={(e) => handleChangeHandler(e)}
        />
        <button className="submitbtn" type="submit">
          {isUpdateFlag ? "SAVE" : "SUBMIT"}
        </button>
      </form>
      <div>
        <table className="tbl styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>AMOUNT</th>
              <th>FROM TIME</th>
              <th>END TIME</th>
              <th>CREATED AT</th>
              <th>UPDATED AT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 &&
              tableData.map((item: any) => {
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.amount}</td>
                    <td>
                      {item.fromTime &&
                        new Date(item.fromTime).toUTCString().split(" ")[4]}
                    </td>
                    <td>
                      {item.toTime &&
                        new Date(item.toTime).toUTCString().split(" ")[4]}
                    </td>
                    <th>{new Date(item.create_at).toLocaleString()}</th>
                    <th>{new Date(item.update_at).toLocaleString()}</th>
                    <td>
                      <button
                        className="btn updt"
                        onClick={() => handleUpdate(item)}
                      >
                        UPDATE
                      </button>
                      &nbsp; &nbsp; &nbsp;
                      <button
                        className="btn dngr"
                        onClick={() => handleDelete(item)}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Link to="/slotPrice" className="slot">
        Slot Price
      </Link>
    </div>
  );
};

export default BasePriceTable;
