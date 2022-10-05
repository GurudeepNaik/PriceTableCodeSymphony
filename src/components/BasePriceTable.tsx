import { useEffect, useState } from "react";
import axios from 'axios'
import './style.css'
import { Link } from "react-router-dom";
const BasePriceTable = () => {
  const rows: { id: number, amount: number, created_at: string, updated_at: string }[] = [];

  const [tableData, setTableData] = useState(rows);
  const [basePriceForm, setBasePriceForm] = useState(0);
  const [isUpdateFlag, setIsUpdateFlag] = useState(false);

  const getBasePriceTable = async () => {
    fetch("http://localhost:8080/basePrice")
      .then((res: any) => res.json())
      .then((res: any) => setTableData(res.message))
      .catch((err: any) => console.log(err))
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!isUpdateFlag) {
      if (tableData.length > 0) {
        window.alert("Cannot Add More Then 1 Table")
        setBasePriceForm(0);
      } else {
        try {
          await axios.post(`http://localhost:8080/basePrice`, { amount: basePriceForm })
          setBasePriceForm(0);
          getBasePriceTable()
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      try {
        console.log(basePriceForm)
        await axios.patch(`http://localhost:8080/basePrice/${tableData[0].id}`, { amout: basePriceForm })
        getBasePriceTable()
        setBasePriceForm(0);
        setIsUpdateFlag(false)
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getBasePriceTable();
  }, []);


  const handleUpdate = async (item: any) => {
    setBasePriceForm(item.amount);
    setIsUpdateFlag(true)
  };
  const handleDelete = async (item: any) => {
    try {
      await axios.delete(`http://localhost:8080/basePrice/${item.id}`)
      let array = tableData
      array = array.filter((itemObj: any) => itemObj.id !== item.id)
      setTableData(array)
      setIsUpdateFlag(false)
    } catch (error) {
      console.log(error);
    }

  };
  const handleChangeHandler = (e: any) => {
    setBasePriceForm(e.target.value)
  }
  return (
    <div className="basePriceContainer">
      <h1 className="h1header basePrice">Base Price</h1>
      <form className="form-basePrice" onSubmit={handleSubmit}>
        <label>Enter Amount</label>
        <input type="number" value={basePriceForm} onChange={(e) => handleChangeHandler(e)} />
        <button className="submitbtn" type="submit">{isUpdateFlag ? ("SAVE") : ("SUBMIT")}</button>
      </form>
      <div>
        <table className="tbl styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>AMOUNT</th>
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
                    <th>{item.created_at.split("T")[0]} {item.created_at.split("T")[1].split(".000Z")[0]}</th>
                    <th>{item.updated_at.split("T")[0]} {item.updated_at.split("T")[1].split(".000Z")[0]}</th>
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
      <Link to='/slotPrice' className="slot" >Slot Price</Link>
    </div>
  );
};

export default BasePriceTable;
