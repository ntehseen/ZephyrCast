import { cn } from "@/utils/cn";
import React from "react";
import { BiSearchAlt } from "react-icons/bi";

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn(
        "flex relative items-center justify-center h-10, props.className"
      )}
    >
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        name=""
        id=""
        placeholder="Search Location"
        className="px-4 py-2 w-[230px] border border-gray-500 rounded-l-md focus:outline-none focus:border-blue-500 h-full"
      />
      <button className="px-4 py-[6px] bg-gray-300  rounded-r-md focus:outline-none hover:bg-gray-500 whitespace-nowrap h-full">
        <BiSearchAlt className="mt-1 ml-2 text-red-400 text-2xl" />
      </button>
    </form>
  );
}
