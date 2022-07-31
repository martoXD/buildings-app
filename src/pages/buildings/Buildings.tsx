import * as React from "react";
import Table from "../../components/shared/Table";
import "./styles/Buildings.scss";
import data from '../../mock-data.json';

type BuildingData = {
  id: string,
  name: string,
  area: number,
  location: string,
  image: string,
};

type BuildingsState = {
  buildings: BuildingData[]
};

const tableHeaders = {
  id: 'Id',
  name: 'Name',
  area: 'Area',
  location: 'Location',
  image: 'Image',
  action: 'Action'
};

export class Buildings extends React.Component<{}, BuildingsState> {

  constructor(props: never){
    super(props);
    this.state = {buildings: []};
  };

  componentDidMount = () => {
    //this.setState(state => {buildings: JSON.parse(data.toString())})
  };

  render() {
    return (
      <div className="container">
        <Table headers={tableHeaders} data={data} actions={['add','edit','delete']} />
      </div>
    );
  }
}

export default Buildings;
