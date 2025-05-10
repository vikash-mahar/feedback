import React from "react";

function Tweet({ tweet, page = false }) {
    return (<>
  <figure className="relative rounded-2xl overflow-hidden max-w-xs pb-10 w-full text-left text-gray-800 bg-gray-300  shadow-md">
    <blockquote className=" bg-gray-100 p-6 text-sm italic leading-relaxed">
      {tweet?.content}
      <div className="absolute top-full left-0 w-0 h-0 border-l-transparent border-r-transparent border-l-[12.5px] border-r-[12.5px] border-t-[25px] border-t-gray-100"></div>
    </blockquote>
    <div className=" h-100px w-full  flex items-end">
        <img
          src={tweet.owner?.avatar}
          alt="Author"
          className="w-[90px] h-[90px] flex items-end rounded-full mt-10 ml-2.5 object-cover"
        />
    </div>
    <div className=" pl-[17px] pb-[11px]  text-white uppercase transform translate-y-1/2">

      <h5 className="font-extrabold opacity-80 text-gray-950">
        {tweet?.owner?.fullName}
      </h5>
      <h5 className="font-normal normal-case text-gray-500 pl-1 ">{tweet?.owner?.email}</h5>
    </div>
  </figure>


</>);}

export default Tweet;