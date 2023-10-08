"use client";
import "./globals.css";
//import type { Metadata } from "next";
import { ApolloWrapper } from "./apolloWrapper";
import { createContext, useState } from "react";
import { Data } from "@/types/global";

// export const metadata: Metadata = {
//   title: "Phone Book Project Assignment",
//   description: "Phone Book Project Assignment",
// };

type DataState = {
  dataLocal: Data;
  getDataLocal: () => void;
  updateDataLocal: (data: Data) => void;
};

export const DataContext = createContext<DataState>({
  dataLocal: { contact: [] },
  getDataLocal: () => {},
  updateDataLocal: (data: Data) => {},
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataLocal, setDataLocal] = useState<Data>({ contact: [] });

  const getDataLocal = () => {
    const data = JSON.parse(localStorage.getItem("contacts") || "[]");
    setDataLocal(data);
  };

  const updateDataLocal = (data: Data) => {
    setDataLocal(data);
  };

  return (
    <DataContext.Provider value={{ dataLocal, getDataLocal, updateDataLocal }}>
      <html lang="en">
        <body>
          <ApolloWrapper>{children}</ApolloWrapper>
        </body>
      </html>
    </DataContext.Provider>
  );
}
