import React from "react";
import "./style.css";

const EmptyState = ({ description }) => {
  return (
    <div
      className="empty_state"
    >
      <img
        src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        alt=""
      />
      <span>{description}</span>
    </div>
  );
};

export default EmptyState;
