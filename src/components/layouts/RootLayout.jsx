import React from "react";
import NavbarBasic from "./Navbar";
import { Outlet } from "react-router";
import FooterComponent from "./Footer";



export default function RootLayout() {
  return (
    <>
      <NavbarBasic />
      <Outlet />
      <FooterComponent/>
     
    </>
  );
}
