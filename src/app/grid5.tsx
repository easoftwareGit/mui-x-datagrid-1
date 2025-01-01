/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
"use client";

// number formatting
// set max and min for dollar amount spinner
// https://mui.com/x/react-data-grid/custom-columns/

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
  GridColTypeDef,
  DataGridProps,
  GridCellEditStopReasons,  
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
  random,
  randomPrice
} from '@mui/x-data-grid-generator';
import { Tooltip } from '@mui/material';

import "./grid.css";

const roles = ['Market', 'Finance', 'Development', 'Testing', 'Management'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const eaRandomPrics = () => { 
  return randomPrice(0, 999);
}

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    fee: eaRandomPrics(),
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    fee: eaRandomPrics(),
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    fee: eaRandomPrics(),
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    fee: eaRandomPrics(),
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    fee: eaRandomPrics(),
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const usdPrice: GridColTypeDef = {
  type: 'number',
  width: 100,
  valueFormatter: (value) => currencyFormatter.format(value),
  cellClassName: 'font-tabular-nums',
  editable: true,
};

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
}

export default function Grid5() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const editingRow = React.useRef<GridRowModel | null>(null);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    // if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    //   event.defaultMuiPrevented = true;
    // }
  };

  // header toolbar
  function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props;  

    // new row at bottom
    const handleAddClick = () => {
      const id = randomId();
      setRows((oldRows) => [
        ...oldRows,
        { id, name: '', age: '', role: '', fee: '',isNew: true },
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
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
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

  const isValidFee = (value: number) => value >= 0 && value <= 999;

  const applyFeeCellColor = (value: number) => {
    if (!isValidFee(value)) {
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

  const getFeeTitle = (value: number) => {
    if (!isValidFee(value)) {
      return 'Fee must be between $0.00 and $999.00';
    }
    return currencyFormatter.format(value)    
  }
  
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
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
      }      
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
      ...usdPrice,      
      // set min and max for dollar amount spinner - start
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 999,
            min: 0,
          }}
        />
      ),
      // set min and max for dollar amount spinner - end
      cellClassName: params => applyFeeCellColor(params.value as number),            
      renderCell: (params) => { 
        const feeErrMsg = getFeeTitle(params.value as number);
        return (
          <div title={feeErrMsg}>
            {currencyFormatter.format(params.value)}
          </div>
        )
      },      
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
      <h3>Grid 5 (expaning on Grid 4)</h3>
      <p>number formatting</p>  
      <p>set max and min for dollar amount spinner</p>
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
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row" 
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}                    
          processRowUpdate={processRowUpdate}

          slots={{ toolbar: EditToolbar }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}          

          // hide footer - start
          // hideFooterPagination
          // hideFooterSelectedRowCount
          hideFooter
          // hide footer - end
        />
      </Box>
    </>      
  );
}
