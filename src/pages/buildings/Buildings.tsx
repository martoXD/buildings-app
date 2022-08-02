import * as React from "react";
import Table from "../../components/shared/Table";
import "./styles/Buildings.scss";
import * as yup from 'yup';
import { getData } from "../../utils/service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

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

  componentDidMount = async (): Promise<void> => {
    let data = await getData();
    console.log('buildings data -> ', this.state.buildings);
    this.setState({ buildings: data});
  };

  render() {
    return (
      <>
        <div className="header">
          <h2>WELCOME</h2>
          <FontAwesomeIcon size="lg" className="icon" icon={faUserCircle} />
        </div>
        <div className="container">
          <div className="container-table">
            {this.state.buildings.length > 0 && 
            <Table headers={tableHeaders} data={this.state.buildings} actions={['add','edit','delete']} validationSchema={buildingSchema} />}
          </div>
        </div>
      </>
    );
  }
}

export default Buildings;
