"use client";

import { GoogleMap } from "@react-google-maps/api";
import { ReactNode } from "react";

type Props = {
  center: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  children?: ReactNode;
};

function BaseMap({ center, children }: Props) {
  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px", }}
      center={center}
      zoom={16}
    >
      {children}
    </GoogleMap>
  );
}

export default BaseMap;
