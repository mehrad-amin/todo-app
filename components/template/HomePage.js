import { useEffect, useState } from "react";
import Tasks from "../module/Tasks";
import { useRouter } from "next/router";

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  console.log(todos);
  const deleteHandler = async (id) => {
    const res = await fetch("/api/todos/", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "success") {
      fetchTodos();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    if (data.status === "success") setTodos(data.data.todos);
  };
  return (
    <div className="home-page">
      <div className="home-page--todo">
        <p>Todo</p>
        <Tasks
          data={todos.todo}
          fetchTodos={fetchTodos}
          next="inProgress"
          deleteHandler={deleteHandler}
        />
      </div>
      <div className="home-page--inProgress">
        <p>in Progress</p>
        <Tasks
          data={todos.inProgress}
          fetchTodos={fetchTodos}
          deleteHandler={deleteHandler}
          next="review"
          back="todo"
        />
      </div>
      <div className="home-page--review">
        <p>Review</p>
        <Tasks
          data={todos.review}
          fetchTodos={fetchTodos}
          deleteHandler={deleteHandler}
          next="done"
          back="inProgress"
        />
      </div>
      <div className="home-page--done">
        <p>Done</p>
        <Tasks
          data={todos.done}
          fetchTodos={fetchTodos}
          back="review"
          deleteHandler={deleteHandler}
        />
      </div>
    </div>
  );
};

export default HomePage;
