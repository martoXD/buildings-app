import * as React from "react";
import { OptionalObjectSchema } from "yup/lib/object";
import './styles/Table.scss';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTrash, faPenSquare, faCheck, faAdd } from '@fortawesome/free-solid-svg-icons';
import * as validator from "../../utils/validator";

type Props = {
  headers: object;
  data: any[];
  actions?: Array<string>;
  validationSchema?: OptionalObjectSchema<{}>;
};

type State = {
    rowId: number;
    data: any[];
    validationErrors: object;
    validationSchema: object;
    isAdding: boolean;
    addedData: any;
    editedData: any;
};

class Table extends React.Component<Props, State> {

  constructor(props: Props){
    super(props);
    this.state = {
      rowId: 0, 
      data: [], 
      editedData: {}, 
      addedData:{}, 
      validationErrors: {}, 
      validationSchema: {}, 
      isAdding: false
    }
  };

  componentDidMount = (): void => {
    let validationFields = this.props.validationSchema?.getDefault();
    console.log('table data -> ', this.state.data);
    this.setState((prevState) => ({ 
        ...prevState, 
        data: [...this.props.data], 
        validationSchema: { ...this.props.validationSchema }, 
        addedData: validationFields
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

  renderRowData = (d:any, i:number, actions?: Array<string>): JSX.Element => {
    return (
      this.state.rowId === d?.id ? this.renderEditableRow(d,i) :
      (<tr key={i}>
          {/* {Object.values(d).map((value: any,i: number) => {
              return (
                  Object.keys(d)[i] !== "image" ? <td key={i}>{value}</td> : 
                  <td key={i}><img alt={value} src={value} /></td>
              )
          })} */}
          {Object.entries(d).map(([key, value]: any, i: number) => {
              return (
                  key !== "image" ? <td key={i}>{value}</td> : 
                  value === null || value === undefined ? <td key={i}></td> : <td key={i}><img alt={value} src={value}/></td>
              )
          })}
          {
          <td className="centered">
              {actions?.some(a => a.toLowerCase().match('edit')) && 
              <FontAwesomeIcon icon={faPenSquare} className="icon" size="lg" onClick={(e: React.MouseEvent<SVGSVGElement>) => this.handleEditClick(e, d.id)} />}
              {actions?.some(a => a.toLowerCase().match('delete')) && 
              <FontAwesomeIcon icon={faTrash} className="icon" size="lg" onClick={(e: React.MouseEvent<SVGSVGElement>) => this.handleDeleteClick(e, d.id)} />}
          </td>
          }
      </tr>)
    )
  };

  renderAddableRow = (): JSX.Element => {
    const data = this.state.data;
    const nextId = data.length > 0 ? this.state.data[data.length - 1].id + 1 : 1;
    return(
      <tr>
        {data.length > 0 && Object.keys(data[0]).map((value: any, i: number) => {
          return (
            Object.keys(data[0])[i] === 'id' ? <td key={i}>{nextId}</td> :
            <td key={i}>
              <input
                type="text"
                name={value}
                placeholder={value}
                onChange={(e) => this.handleEditFormChange(e)}
                ></input>
            </td>
          )
        })}
        <td className="centered">
          {Object.values(this.state.validationErrors).every(v => v === null) && 
          <FontAwesomeIcon size="lg" className="icon" icon={faCheck} onClick={(e: React.MouseEvent<SVGSVGElement>) => this.handleAddSubmit(e)} />}
          <FontAwesomeIcon size="lg" className="icon" icon={faXmark} onClick={(e: React.MouseEvent<SVGSVGElement>) => this.handleAddCancel(e)} />
        </td>
      </tr>)
  };

  renderEditableRow = (d:any, i:number): JSX.Element => {
    return (
        <tr key={i}>
          {Object.values(d).map((row: any,i: number) => {
            return (
                Object.keys(d)[i] === 'id' ? <td key={i}>{row}</td> :
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
            <FontAwesomeIcon size="lg" className="icon" icon={faCheck} onClick={(e: React.MouseEvent<SVGSVGElement>) => this.handleEditFormSubmit(e)} />}
            <FontAwesomeIcon size="lg" className="icon" icon={faXmark} onClick={(e: React.MouseEvent<SVGSVGElement>) => this.handleCancelClick(e)} />
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

  handleAddSubmit = async (event: React.MouseEvent<SVGSVGElement>): Promise<void> => {
    event.preventDefault();
    let validationSchema: any = this.props.validationSchema;
    
    const newData: any[] = [...this.state.data];

    const index = newData.length > 0 ? this.state.data[newData.length - 1].id + 1 : 1;

    if(Object.values(this.state.addedData).length > 0){
      if(Object.keys(this.state.addedData)[0] === 'id'){
        newData[index] = { ...this.state.addedData };
      }
      else{
        const reversedValues = Object.values(this.state.addedData).reverse();
        const reversedKeys = Object.keys(this.state.addedData).reverse();

        reversedKeys.forEach((value,key) => {
          console.log(key, value);
          newData[index] = { ...newData[index], [value]: reversedValues[key] };
        });
      }
    }
    let [isValid] = await validator.validateObject(validationSchema, newData[index]);

    if(isValid){
      this.setState((prevState) => ({ 
        ...prevState, data: newData, addedData: { ...this.props.validationSchema?.getDefault() }, isAdding: false
      }));
    }
  };

  handleAddCancel = (event: React.MouseEvent<SVGSVGElement>): void => {
    event.preventDefault();
    this.setState((prevState) => ({ 
      ...prevState, isAdding: false, validationErrors: {}
    }));
  };

  handleEditFormSubmit = (event: React.MouseEvent<SVGSVGElement>): void => {
    event.preventDefault();
    
    const newData: any[] = [...this.state.data.filter(d => d !== undefined)];

    const index: number = newData.findIndex((data) => data.id === this.state.rowId);

    if(Object.values(this.state.editedData).length > 0){
      newData[index] = this.state.editedData;
    }

    this.setState((prevState) => ({ 
        ...prevState, data: newData, rowId: 0
    }));
  };

  handleEditFormChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault();
    let validationSchema: any = this.props.validationSchema;

    const fieldName: any = event.target.getAttribute("name");
    const fieldValue: string = event.target.value;
    
    let newFormData: any = { ...this.state.data.find(d => d?.id === this.state.rowId) };
    if(this.state.isAdding){
      newFormData =  { ...this.state.addedData };
    }
    newFormData[fieldName] = fieldValue;

    // validate field
    let [isValid, field] = await validator.validateField(validationSchema, newFormData, fieldName);
    if(isValid){
      this.setState((prevState) => ({
        ...prevState, validationErrors: { [fieldName]: null }
      }));
    }
    else {
      this.setState((prevState) => ({
        ...prevState, validationErrors: { ...prevState.validationErrors, [fieldName]: field }
      }));
    }

    if(this.state.isAdding){
      this.setState((prevState) => ({
        ...prevState, addedData: newFormData
      }));
    }
    else {
      this.setState((prevState) => ({
        ...prevState, editedData: newFormData
      }));
    }
  };

  handleEditClick = (event: React.MouseEvent<SVGSVGElement>, id: number): void => {
    event.preventDefault();
    if(!this.state.isAdding){
      this.setState((prevState) => ({ 
        ...prevState, rowId: id
      }));
    }
  };

  handleCancelClick = (event: React.MouseEvent<SVGSVGElement>): void => {
    event.preventDefault();
    this.setState((prevState) => ({ 
        ...prevState, rowId: 0, validationErrors: {}
    }));
  };

  handleDeleteClick = (event: React.MouseEvent<SVGSVGElement>, id: number): void => {
    event.preventDefault();
    let filteredData: any[] = this.state.data.filter(d => d !== undefined).filter(d => d.id !== id);
    if(this.state.data.length !== 1){
      this.setState((prevState) => ({ 
        ...prevState, data: filteredData
      }));
    }
  };

  handleAddClick = (event: React.MouseEvent<SVGSVGElement>,): void => {
    event.preventDefault();
    this.setState((prevState) => ({ 
      ...prevState, isAdding: true, rowId: 0, addedData: { ...prevState.addedData , id: prevState.data[prevState.data.length - 1].id + 1 }
    }));
  };

  render() {
    const {headers, actions} = this.props;
    return (
      <React.Fragment>
            {actions?.some(a => a.toLowerCase().match('add')) && 
            <FontAwesomeIcon icon={faAdd} className="icon" size="lg" onClick={(e: React.MouseEvent<SVGSVGElement>) => this.handleAddClick(e)} />}
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
                {this.state.data?.filter(d => d !== undefined).map((d,i) => {
                    return (
                        this.renderRowData(d,i,actions)
                    )
                })}
                {this.state.isAdding && this.renderAddableRow()}
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
