import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EditPage = () => {
  const [initialData, setInitialData] = useState("");
  const [form, setForm] = useState({
    name: "",
    lastName: "",
  });
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        lastName: initialData.lastName,
      });
    }
  }, [initialData]);
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };
  const submitHandler = async () => {
    console.log(form);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.status === "success") router.replace("/");
  };
  const router = useRouter();
  const {
    query: { userId },
    isReady,
  } = router;

  useEffect(() => {
    if (isReady) {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => setInitialData(data.data));
    }
  }, [isReady]);
  return (
    <>
      <div className="profile-form__input">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form?.name}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label htmlFor="lastName">last Name:</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form?.lastName}
            onChange={changeHandler}
          />
        </div>
      </div>
      <button onClick={submitHandler}>Submit</button>
    </>
  );
};

export default EditPage;
