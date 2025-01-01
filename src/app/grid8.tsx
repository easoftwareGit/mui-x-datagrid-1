/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
"use client";

// one field base on another
// multiple fileds update when one field changes
// editMode='row' for new row only
// https://mui.com/x/react-data-grid/editing/
// https://mui.com/x/api/data-grid/data-grid-premium/#data-grid-premium-prop-editMode

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
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
  GridRowEditStopReasons,
  GridSlotProps,
  GridPreProcessEditCellProps,
  GridCellParams,
  GridEditInputCell,
  GridValueGetter,
  GridValueParser,
  GridValueFormatter,
  useGridApiEventHandler,
  GridCellEditStopParams,
  MuiEvent,
  GridCellEditStopReasons,
  GridCellModesModel,
  GridCellModes,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
  randomPrice,
} from '@mui/x-data-grid-generator';

import "./grid.css";
import { Link } from '@mui/material';

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

export default function Grid8() {  
  // editMode='row' for new row only - start
  const [gridEditMode, setGridEditMode] = React.useState<'cell' | 'row'>('cell');
  // editMode='row' for new row only - end
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});  

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    // editMode='row' for new row only - start
    setGridEditMode('cell');       
    // editMode='row' for new row only - end
  };

  // header toolbar
  function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props;

    // new row at bottom
    const handleAddClick = () => {
      // editMode='row' for new row only - start
      setGridEditMode('row');      
      // editMode='row' for new row only - end
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

    const handleDebugClick = () => { 
      console.log('rows', rows);
    };

    return (
      <GridToolbarContainer>
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
      </GridToolbarContainer>
    );
  }

  const handleEditClick = (id: GridRowId) => () => {
    // editMode='row' for new row only - start
    setGridEditMode('row');    
    // editMode='row' for new row only - end
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    // editMode='row' for new row only - start
    setGridEditMode('cell');    
    // editMode='row' for new row only - end
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    // editMode='row' for new row only - start
    setGridEditMode('cell');    
    // editMode='row' for new row only - end
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // row updates when user presses [Enter]
  const processRowUpdate = (newRow: GridRowModel) => {
    // editMode='row' for new row only - start
    setGridEditMode('cell');    
    // editMode='row' for new row only - end
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
    // one field base on another - start
    // multiple fileds update when one field changes - start
    return { 
      ...row,
      numBrkts1: numBrkts,
      numBrktsFee1: brktsFee1,
      total: row.checkAmount + brktsFee1 + row.numBrktsFee2
    }
    // one field base on another - end
    // multiple fileds update when one field changes - end
  }

  const setBrktsFee2 = (value: number, row: GridRowModel) => {
    const numBrkts = value ? Math.trunc(Number(value)) : 0;
    let brktsFee2 = 0;
    if (isValidNumBrkts(numBrkts)) {
      brktsFee2 = numBrkts * brktFee;
    }
    // one field base on another - start
    // multiple fileds update when one field changes - start
    return { 
      ...row,
      numBrkts2: numBrkts,
      numBrktsFee2: brktsFee2,
      total: row.checkAmount + row.numBrktsFee1 + brktsFee2
    }
    // multiple fileds update when one field changes - end
    // one field base on another - end
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
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
      type: 'date',
      width: 180,
      editable: true,      
    },
    {
      field: 'fee',
      headerName: 'Fee',  
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
      type: 'number',
      width: 100,
      align: 'right',
      headerAlign: 'right',      
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    {
      field: 'numBrkts1',
      headerName: 'Bkts 1-3',
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
      type: 'number',
      width: 100,
      align: 'right',
      headerAlign: 'right',      
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      width: 100,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value?: number) => currencyFormatter.format(value!),      
    },
    {
      field: 'role',
      headerName: 'Department',
      width: 220,
      editable: true,
      type: 'singleSelect',      
      valueOptions: roles,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
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
      <h3>Grid 8 (expaning on Grid 7)</h3>
      <p>one field base on another</p>
      <p>multiple fileds update when one field changes</p>      
      <p>editMode=&quot;row&quot; for new row only</p>
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >        
        <div style={{ display: 'flex', flexDirection: 'column' }}>       
          <DataGrid
            rows={rows}
            columns={columns}       
            // editMode='row' for new row only - start
            editMode={gridEditMode}
            // editMode='row' for new row only - end
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
        </div> {/* autoheight - end div props */}
      </Box>
    </>      
  );
}
