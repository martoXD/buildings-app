import * as React from "react";
import { Outlet } from "react-router";
import Footer from "./Footer";

export class Layout extends React.Component {

  render() {
    return (
        <React.Fragment>
            <Outlet />
            <Footer />
        </React.Fragment>
    );
  }
}

export default Layout;
