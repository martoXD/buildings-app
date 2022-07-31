import * as React from "react";
import "./styles/Home.scss";

export class Home extends React.Component {

  render() {
    return (
      <div className="container">
        <h2 className="heading">Buildings</h2>
        <img alt="buildings" src='assets/buildings.png' />
        <span className="buildings-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing 
            elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio euismod 
            lacinia at quis risus sed vulputate odio. Egestas diam in arcu cursus euismod quis viverra. 
            Consectetur purus ut faucibus pulvinar elementum integer enim. Tincidunt dui ut ornare 
            lectus sit amet est placerat in. Cras ornare arcu dui vivamus arcu felis bibendum ut tristique. 
            Imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque. Maecenas ultricies 
            mi eget mauris pharetra et ultrices. Iaculis nunc sed augue lacus viverra vitae congue eu consequat. 
            Volutpat ac tincidunt vitae semper quis lectus nulla at. Pellentesque eu tincidunt tortor aliquam 
            nulla facilisi cras.
        </span>
      </div>
    );
  }
}

export default Home;
