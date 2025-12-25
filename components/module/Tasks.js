import { RiMastodonLine } from "react-icons/ri";
import { BiLeftArrowAlt } from "react-icons/bi";
import { BiRightArrowAlt } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";

const Tasks = ({ data, fetchTodos, next, back, deleteHandler }) => {
  const changeStatus = async (id, status) => {
    const res = await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "success") fetchTodos();
  };

  return (
    <div className="tasks">
      {data?.map((i, index) => (
        <div key={i._id || index} className="tasks__card">
          <button
            className="delete-button"
            onClick={() => deleteHandler(i._id)}
          >
            <TiDelete />
          </button>
          <span className={i.status}></span>
          <RiMastodonLine />
          <h4>{i.title}</h4>
          <div>
            {back ? (
              <button
                className="button-back"
                onClick={() => changeStatus(i._id, back)}
              >
                <BiLeftArrowAlt /> Back
              </button>
            ) : null}
            {next ? (
              <button
                className="button-next"
                onClick={() => changeStatus(i._id, next)}
              >
                Next
                <BiRightArrowAlt />
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
