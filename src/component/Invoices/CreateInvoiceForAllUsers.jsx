import { useContext } from "react";
import { AppContext } from "../../App";

const CreateInvoiceForAllUsers = () => {
  const { setOnload, token, route } = useContext(AppContext);
  const Create = function () {
    setOnload(true);
    fetch(`${route}/marketing/createInvoiceForAllUsers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setOnload(false));
  };
  return (
    <div className="main-sec">
      <h1 style={{ textAlign: "center" }}>Create Invoice For All Users</h1>
      <button
        className="submit"
        type="button"
        onClick={Create}
        style={{ width: "fit", margin: "50px auto" }}
      >
        Create
      </button>
    </div>
  );
};

export default CreateInvoiceForAllUsers;
