import * as React from "react";
import Table from "../../components/shared/Table";
import "./styles/Buildings.scss";
import data from '../../mock-data.json';
import * as yup from 'yup';

type BuildingData = {
  id: number,
  name: string,
  area: string,
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

const buildingSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
  area: yup.string().required('Area is required'),
  location: yup.string().notRequired().nullable(),
  image: yup.string().notRequired().nullable()
});

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
        <div className="container-table">
          <Table headers={tableHeaders} data={data} actions={['add','edit','delete']} validationSchema={buildingSchema} />
        </div>
      </div>
    );
  }
}

export default Buildings;
