import * as React from "react";
import { OptionalObjectSchema } from "yup/lib/object";
import './styles/Table.scss';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrash, faPenSquare, faCheck } from '@fortawesome/free-solid-svg-icons';

type Props = {
  headers: object;
  data: any[];
  actions?: Array<string>;
  validationSchema?: OptionalObjectSchema<{}>;
};

type State = {
    rowId: number;
    data: any[];
    editedData: object;
    validationErrors: object;
    validationSchema: object;
};

class Table extends React.Component<Props, State> {

  constructor(props: Props){
    super(props);
    this.state = {rowId: 0, data: [], editedData: {}, validationErrors: {}, validationSchema: {}}
  };

  componentDidMount = (): void => {
    this.setState((prevState) => ({ 
        ...prevState, data: [...this.props.data], validationSchema: { ...this.props.validationSchema }
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

  handleEditFormSubmit = (event: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    event.preventDefault();
    
    const newData: any[] = [...this.state.data];

    const index: number = newData.findIndex((data) => data.id === this.state.rowId);

    if(Object.values(this.state.editedData).length > 0){
      newData[index] = this.state.editedData;
    }

    this.setState((prevState) => ({ 
        ...prevState, editedData: {}, data: newData, rowId: 0
    }));
  };

  handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    let validationSchema: any = this.props.validationSchema;

    const fieldName: any = event.target.getAttribute("name");
    const fieldValue: string = event.target.value;

    const newFormData = { ...this.props.data.find(d => d.id === this.state.rowId)};
    newFormData[fieldName] = fieldValue;

    // validate field
    validationSchema.validate(newFormData, { abortEarly: false }).then(() => {
      this.setState((prevState) => ({ 
        ...prevState, validationErrors: { ...prevState.validationErrors, [fieldName]: null }
      }));
    })
    .catch((err:any) => {
      this.setState((prevState) => ({ 
        ...prevState, validationErrors: { ...prevState.validationErrors, [fieldName]: err.message}
      }));
    });

    this.setState((prevState) => ({ 
        ...prevState, editedData: newFormData
    }));
  };

  handleEditClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number): void => {
    event.preventDefault();
    this.setState((prevState) => ({ 
        ...prevState, rowId: id
    }));
  };

  handleCancelClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    event.preventDefault();
    this.setState((prevState) => ({ 
        ...prevState, rowId: 0, validationErrors: {}
    }));
  };

  handleDeleteClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>, id: number): void => {
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
                    name={Object.keys(d)[i]}
                    placeholder={row}
                    onChange={(e) => this.handleEditFormChange(e)}
                    ></input>
                </td>
            )
          })}
          <td className="centered">
            {Object.values(this.state.validationErrors).every(v => v === null) && 
            <FontAwesomeIcon size="lg" className="icon" icon={faCheck} onClick={(e) => this.handleEditFormSubmit(e)} />}
            <FontAwesomeIcon size="lg" className="icon" icon={faXmark} onClick={(e) => this.handleCancelClick(e)} />
          </td>
        </tr>
      );
  };

  renderError = (value: string, i: number): JSX.Element => {
    return (
      <Alert className='error' key={i} variant='danger'>
        {value}
      </Alert>
    )
  };

  render() {
    const {headers, actions} = this.props;
    return (
      <React.Fragment>
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
                                {actions?.some(a => a.toLowerCase().match('edit')) && 
                                <FontAwesomeIcon icon={faPenSquare} className="icon" size="lg" onClick={e => this.handleEditClick(e, d.id)} />}
                                {actions?.some(a => a.toLowerCase().match('delete')) && 
                                <FontAwesomeIcon icon={faTrash} className="icon" size="lg" onClick={e => this.handleDeleteClick(e, d.id)} />}
                            </td>
                            }
                        </tr>)
                    )
                })}
                </tbody>
            </table>
            {Object.values(this.state.validationErrors).map((value, i) => {
                return (
                  value && this.renderError(value,i)
                )
            })}
      </React.Fragment>
    )
  }
};

export default Table;
