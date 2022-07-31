import * as React from "react";
import './styles/Table.scss';

type Props = {
  headers: object;
  data: any[];
  actions: Array<string>;
};

type State = {
    rowId: number;
    data: any[];
    editedData: object;
};

class Table extends React.Component<Props, State> {

  constructor(props: Props){
    super(props);
    this.state = {rowId: 0, data: [], editedData: {}}
  };

  componentDidMount = (): void => {
    this.setState((prevState) => ({ 
        ...prevState, data: [...this.props.data]
    }));
  };

  renderHeaderData = (th:any, i:number): JSX.Element => {
    if(th === 'Image' || th === 'Action'){
        return <th className="centered" key={i}>{th}</th>
    }
    else if(th === 'Name' || th === 'Location'){
        return <th className="extended" key={i}>{th}</th>
    }
    return <th key={i}>{th}</th>
  };

  renderRowData = (d:any, i:number): JSX.Element => {
    return <td key={i}>{d}</td>;
  };

  handleEditFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    
    const newData: any[] = [...this.state.data];

    const index: number = newData.findIndex((data) => data.id === this.state.rowId);

    newData[index] = this.state.editedData;

    this.setState((prevState) => ({ 
        ...prevState, editedData: {}, data: newData, rowId: 0
    }));
  };

  handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();

    const fieldName: any = event.target.getAttribute("name");
    const fieldValue: string = event.target.value;

    const newFormData = { ...this.props.data.find(d => d.id === this.state.rowId) };
    newFormData[fieldName] = fieldValue;

    this.setState((prevState) => ({ 
        ...prevState, editedData: newFormData
    }));
  };

  handleEditClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number): void => {
    event.preventDefault();
    this.setState((prevState) => ({ 
        ...prevState, rowId: id
    }));
  };

  handleCancelClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    this.setState((prevState) => ({ 
        ...prevState, rowId: 0
    }));
  };

  handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number): void => {
    event.preventDefault();
    let filteredData: any[] = this.state.data.filter(d => d.id !== id);
    this.setState((prevState) => ({ 
        ...prevState, data: filteredData
    }));
  };

  renderEditableRow = (d:any, i:number): JSX.Element => {
    return (
        <tr key={i}>
          {Object.values(d).map((row: any,i: number) => {
            return (
                Object.keys(d)[i] === 'id' ? this.renderRowData(row,i) :
                <td key={i}>
                    <input
                    type="text"
                    required={(Object.keys(d)[i] === 'id' || Object.keys(d)[i] === 'name' || Object.keys(d)[i] === 'area') && true}
                    name={Object.keys(d)[i]}
                    placeholder={row}
                    onChange={(e) => this.handleEditFormChange(e)}
                    ></input>
                </td>
            )
          })}
          <td className="centered">
            <button onClick={(e) => this.handleEditFormSubmit(e)}>Save</button>
            <button onClick={(e) => this.handleCancelClick(e)}>Cancel</button>
          </td>
        </tr>
      );
  };

  render() {
    const {headers, actions} = this.props;
    return (
            <table>
                <thead>
                    <tr>
                        {Object.values(headers).map((th,i) => {
                            return (
                                this.renderHeaderData(th,i)
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                {this.state.data?.map((d,i) => {
                    return (
                        this.state.rowId === d.id ? this.renderEditableRow(d,i) :
                        (<tr key={i}>
                            {Object.values(d).map((value,i) => {
                                return (
                                    this.renderRowData(value,i)
                                )
                            })}
                            {
                            <td className="centered">
                                {actions.some(a => a.toLowerCase().match('edit')) && <button onClick={e => this.handleEditClick(e, d.id)}>EDIT</button>}
                                {actions.some(a => a.toLowerCase().match('delete')) && <button onClick={e => this.handleDeleteClick(e, d.id)}>DEL</button>}
                            </td>
                            }
                        </tr>)
                    )
                })}
                </tbody>
            </table>
    )
  }
};

export default Table;
