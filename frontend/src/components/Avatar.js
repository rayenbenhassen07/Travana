"use client";

import Image from "next/image";

const Avatar = ({ src, width, height }) => {
  return (
    <Image
      className="rounded-full"
      height={width}
      width={height}
      alt="Avatar"
      src={src || "/images/avatar.png"}
    />
  );
};

export default Avatar;
