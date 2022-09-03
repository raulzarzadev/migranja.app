import React from "react";
import Nav from "./nav";
export interface LayoutProps {
  children: React.ReactNode;
}
function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Nav />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
