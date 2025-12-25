import Link from "next/link";
import React from "react";

const ProfData = ({ data, session }) => {
  return (
    <div className="profile-data">
      <div>
        <span>Name:</span>
        <p>{data.name}</p>
      </div>
      <div>
        <span>lastName:</span>
        <p>{data.lastName}</p>
      </div>
      <div>
        <span>Email:</span>
        <p>{data.email}</p>
      </div>
      <button className="edit_button">
        <Link href={`/edit/${session.data.user.id}`}>Edit</Link>
      </button>
    </div>
  );
};

export default ProfData;
