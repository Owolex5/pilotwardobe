// src/components/Home/Categories/SingleItem.tsx

import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import Link from "next/link";

// Remove the local interface — it's unused and causing confusion
// We use the imported Category type instead

const SingleItem = ({ item }: { item: Category }) => {
  return (
    <Link href={item.link} className="group flex flex-col items-center p-4">
      <div className="max-w-[140px] w-full bg-blue-50 h-36 rounded-full flex items-center justify-center mb-5 shadow-md group-hover:shadow-xl group-hover:bg-blue-100 transition-all duration-300">
        <Image 
          src={item.img} 
          alt={item.title} 
          width={90} 
          height={90} 
          className="object-contain group-hover:scale-110 transition duration-300"
        />
      </div>

      <h3 className="font-semibold text-center text-dark group-hover:text-blue transition">
        {item.title}
      </h3>
    </Link>
  );
};

export default SingleItem;