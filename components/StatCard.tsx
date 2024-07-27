import clsx from "clsx";
import React from "react";
import Image from 'next/image'

interface Props {
  count: number;
  label: string;
  icon: string;
  type: "appointment" | "pending" | "cancelled";
}

const StatCard = (props: Props) => {
  const { count = 0, label, icon, type } = props;
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointment",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
      <Image
            src={icon}
            height={32}
            width={162}
            alt={label}
            className="h-8 w-fit"
          />
 
          <h2 className="text-32-bold text-white">{count}</h2>
      </div>
      <p className="text-14-regular">{label}</p>
    </div>
  );
};

export default StatCard;
