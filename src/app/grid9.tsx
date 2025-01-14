/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
"use client";

// only grid scrolls
// format header cells
// show error message for first found error
// https://mui.com/x/react-data-grid/scrolling/#scrolling-to-specific-cells

import * as React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import ErrorIcon from '@mui/icons-material/Error';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,  
  GridSlotProps,  
  GridCellParams,
  GridEditInputCell,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
  randomPrice,
} from '@mui/x-data-grid-generator';

import "./grid.css";

const roles = ['Market', 'Finance', 'Development', 'Testing', 'Management'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const minPrice = 0;
const maxPrice = 999;
const minBrkts = 0;
const maxBrkts = 8;
const brktFee = 5;

const eaRandomPrice = () => { 
  return randomPrice(minPrice, maxPrice);
}

type Row = (typeof initialRows)[number];

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    fee: eaRandomPrice(),
    checkMe: false,
    checkAmount: 0,
    numBrkts1: 4,
    numBrktsFee1: 20,
    numBrkts2: 4,
    numBrktsFee2: 20,
    total: 40,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    fee: eaRandomPrice(),
    checkMe: true,
    checkAmount: 5,
    numBrkts1: 6,
    numBrktsFee1: 30,
    numBrkts2: 6,
    numBrkts2Fee2: 30,
    total: 65,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    fee: eaRandomPrice(),
    checkMe: true,
    checkAmount: 5,
    numBrkts1: 5,
    numBrktsFee1: 25,
    numBrkts2: 5,
    numBrktsFee2: 25,
    total: 55,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    fee: eaRandomPrice(),
    checkMe: false,
    checkAmount: 0,
    numBrkts1: 0,
    numBrktsFee1: 0,
    numBrkts2: 0,
    numBrktsFee2: 0,
    total: 0,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    fee: eaRandomPrice(),
    checkMe: false,
    checkAmount: 0,
    numBrkts1: 0,
    numBrktsFee1: 0,
    numBrkts2: 0,
    numBrktsFee2: 0,
    total: 0,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    fee: eaRandomPrice(),
    checkMe: true,
    checkAmount: 5,
    numBrkts1: 4,
    numBrktsFee1: 20,
    numBrkts2: 4,
    numBrktsFee2: 20,
    total: 45,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    fee: eaRandomPrice(),
    checkMe: true,
    checkAmount: 5,
    numBrkts1: 8,
    numBrktsFee1: 40,
    numBrkts2: 8,
    numBrktsFee2: 40,
    total: 85,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    fee: eaRandomPrice(),
    checkMe: true,
    checkAmount: 5,
    numBrkts1: 6,
    numBrktsFee1: 30,
    numBrkts2: 6,
    numBrktsFee2: 30,
    total: 65,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

export default function Grid9() {  
  const [gridEditMode, setGridEditMode] = React.useState<'cell' | 'row'>('cell');  
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});  

  const [errorMsg, setErrorMsg] = React.useState<string>('');

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    setGridEditMode('cell');           
  };

  // header toolbar
  function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props;

    // new row at bottom
    const handleAddClick = () => {      
      setGridEditMode('row');            
      const id = randomId();      
      setRows((oldRows) => [
        ...oldRows,
        {
          id, name: '', age: '', role: '', fee: 0,
          checkMe: false,
          checkAmount: 0,
          numBrkts1: 0,
          numBrktsFee1: 0,
          numBrkts2: 0,
          numBrktsFee2: 0,      
          total: 0,
          isNew: true
        },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };

    const handleClick = () => { };

    return (
      <GridToolbarContainer
        sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}
      >
        <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
          Add 
        </Button>
        <Button color="info" startIcon={<EditIcon />} onClick={handleClick}>
          Edit
        </Button>
        <Button color="error" startIcon={<DeleteIcon />} onClick={handleClick}>
          Delete
        </Button>
        <Button color="inherit" startIcon={<BugReportIcon />} onClick={handleDebugClick}>
          Debug
        </Button>
        {/* show error message for first found error - start */}
        <Button color="warning" startIcon={<ErrorIcon />} onClick={handleErrorMsgClick}>
          Error Message
        </Button>
        {/* show error message for first found error - end */}
      </GridToolbarContainer>
    );
  }

  const handleEditClick = (id: GridRowId) => () => {    
    setGridEditMode('row');        
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {    
    setGridEditMode('cell');        
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {    
    setGridEditMode('cell');        
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleDebugClick = () => { 
    console.log('rows', rows);
  };    

  // show error message for first found error - start
  const handleErrorMsgClick = () => {
    let errMsg = '';
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!ageIsValid(row.age as number)) { 
        errMsg = `Row for ${row.name} has invalid Age`;
        break;
      }
      if (!isValidFee(row.fee as number)) { 
        errMsg = `Row for ${row.name} has invalid Fee`;
        break;
      }
      if (!isValidNumBrkts(row.numBrkts1 as number)) { 
        errMsg = `Row for ${row.name} has invalid Brkts 1-3`;
        break;
      }
      if (!isValidNumBrkts(row.numBrkts2 as number)) { 
        errMsg = `Row for ${row.name} has invalid Brkts 4-6`;
        break;
      }
    }    
    if (errMsg !== '') {
      alert(errMsg);
    }
  }
  // show error message for first found error - end

  const processRowUpdate = (newRow: GridRowModel) => {

    setGridEditMode('cell');        
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const ageIsValid = (value: number) => value >= 0 && value <= 120;
  
  const applyAgeCellColor = (value: number) => {
    if (!ageIsValid(value)) {
      return 'cellError';
    }
    return '';
  }

  const getAgeTitle = (value: number) => {
    if (!ageIsValid(value)) {
      return 'Age must be between 0 and 120';
    }
    return value.toString();    
  }

  const isValidFee = (value: number) => value >= minPrice && value <= maxPrice;

  const applyFeeCellColor = (value: number) => {
    if (!isValidFee(value)) {
      return 'cellError';
    }
    return '';
  }  

  const isValidNumBrkts = (value: number) => value >= minBrkts && value <= maxBrkts;

  const applyBrktCellColor = (value: number) => {
    if (!isValidNumBrkts(value)) {
      return 'cellError';
    }
    return '';
  }

  const handleCellClick = (params: GridCellParams, event: React.MouseEvent) => {  
    if (!params.isEditable) return;
    if (params.field !== 'checkMe' || params.cellMode !== 'edit') return;    
    setRows(rows.map((row) => {
      if (row.id === params.id) {
        // checkbox is clicked, but value not updated yet
        const newChecked = params.value ? false : true;
        const newCheckAmount = newChecked ? 5 : 0;
        // set other fields as meeded.
        return {
          ...row,
          checkMe: newChecked,
          checkAmount: newCheckAmount,
          total: newCheckAmount + row.numBrktsFee1 + row.numBrktsFee2
        }
      } else {
        return {...row}
      }
    }))  
  }

  const setBrktsFee1 = (value: number, row: GridRowModel) => {
    const numBrkts = value ? Math.trunc(Number(value)) : 0;
    let brktsFee1 = 0;
    if (isValidNumBrkts(numBrkts)) {
      brktsFee1 = numBrkts * brktFee;
    }
    return { 
      ...row,
      numBrkts1: numBrkts,
      numBrktsFee1: brktsFee1,
      total: row.checkAmount + brktsFee1 + row.numBrktsFee2
    }
  }

  const setBrktsFee2 = (value: number, row: GridRowModel) => {
    const numBrkts = value ? Math.trunc(Number(value)) : 0;
    let brktsFee2 = 0;
    if (isValidNumBrkts(numBrkts)) {
      brktsFee2 = numBrkts * brktFee;
    }
    return { 
      ...row,
      numBrkts2: numBrkts,
      numBrktsFee2: brktsFee2,
      total: row.checkAmount + row.numBrktsFee1 + brktsFee2
    }
  }  

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      // format header cells - start
      headerClassName: 'my-grid-header',
      // format header cells - end
      width: 180,
      editable: true,      
    },
    {
      field: 'age',
      headerName: 'Age',
      headerClassName: 'my-grid-header',
      type: 'number',
      width: 80,
      align: 'left',
      headerAlign: 'left',      
      editable: true,            
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 120,
            min: 0,
          }}
        />
      ),
      cellClassName: params => applyAgeCellColor(params.value as number),
      renderCell: (params) => { 
        const ageErrMsg = getAgeTitle(params.value as number);
        return (
          <div title={ageErrMsg}>
            {params.value}
          </div>
        )
      },      
    },
    {
      field: 'joinDate',
      headerName: 'Join date',
      headerClassName: 'my-grid-header',
      type: 'date',
      width: 180,
      editable: true,      
    },
    {
      field: 'fee',
      headerName: 'Fee',  
      headerClassName: 'my-grid-header',
      align: 'right',
      headerAlign: 'right',
      type: 'number',
      editable: true,      
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: maxPrice,
            min: minPrice,
          }}
        />
      ),     
      cellClassName: params => applyFeeCellColor(params.value as number),
      valueGetter: (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100,
      valueParser: (value) => value.replace('$', ''),
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    {
      field: 'checkMe',
      headerName: 'Check',
      headerClassName: 'my-grid-header',
      type: 'boolean',
      editable: true,
      width: 80,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (value, row) => row.checkMe ? 1 : 0,      
    },
    {
      field: 'checkAmount',      
      headerName: 'Amount',
      headerClassName: 'my-grid-header',
      type: 'number',
      width: 100,
      align: 'right',
      headerAlign: 'right',      
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    {
      field: 'numBrkts1',
      headerName: 'Bkts 1-3',
      headerClassName: 'my-grid-header',
      type: 'number',
      width: 80,
      editable: true,
      align: 'right',
      headerAlign: 'right',
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: maxBrkts,
            min: minBrkts,
          }}
        />
      ),
      valueSetter: setBrktsFee1,      
      cellClassName: params => applyBrktCellColor(params.value as number),
    },    
    {
      field: 'numBrktsFee1',
      headerName: 'Fee 1-3',
      headerClassName: 'my-grid-header',
      type: 'number',
      width: 100,
      align: 'right',
      headerAlign: 'right',  
      valueSetter: setBrktsFee1,
      valueGetter: (value, row) => isValidNumBrkts(row.numBrkts1) ? row.numBrkts1 * brktFee : 0,
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    {
      field: 'numBrkts2',
      headerName: 'Bkts 4-6',
      headerClassName: 'my-grid-header',
      type: 'number',
      width: 80,
      editable: true,
      align: 'right',
      headerAlign: 'right',
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: maxBrkts,
            min: minBrkts,
          }}
        />
      ),
      valueSetter: setBrktsFee2,
      cellClassName: params => applyBrktCellColor(params.value as number),
    },    
    {
      field: 'numBrktsFee2',
      headerName: 'Fee 4-6',
      headerClassName: 'my-grid-header',
      type: 'number',
      width: 100,
      align: 'right',
      headerAlign: 'right',      
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    {
      field: 'total',
      headerName: 'Total',
      headerClassName: 'my-grid-header',
      type: 'number',
      width: 100,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value?: number) => currencyFormatter.format(value!),      
    },
    {
      field: 'role',
      headerName: 'Department',
      headerClassName: 'my-grid-header',
      width: 220,
      editable: true,
      type: 'singleSelect',      
      valueOptions: roles,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      headerClassName: 'my-grid-header',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>      
      <h3>Grid 9 (expaning on Grid 8)</h3>
      <p>only grid scrolls</p>
      <p>format header cells</p>
      <p>show error message for first found error</p>           
      {/* only grid scrolls - start div */}
      <div
        id='my_grid'
        style={{ height: 500, width: '100%', overflow: 'auto' }}
      >
        <DataGrid
          rows={rows}
          columns={columns}                   
          editMode={gridEditMode}            
          rowModesModel={rowModesModel}            
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}           
          processRowUpdate={processRowUpdate}                                    
          
          slots={{ toolbar: EditToolbar }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}

          hideFooter                      
          
          onCellClick={handleCellClick}
                      
        />        
      </div> {/* only grid scrolls - end div*/}        
    </>      
      
  );
}
