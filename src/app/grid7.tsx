/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
"use client";

// checkbox cell
// autoheight
// https://mui.com/x/react-data-grid/layout/#flex-parent-container
// one field base on value from another
// setting checkbox to true sets Amount to 5
// setting checkbox to false sets Amount to 0
// https://mui.com/x/react-data-grid/editing/

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

export default function Grid7() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

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
        { id, name: '', age: '', role: '',  fee: 0, checkMe: false, checkAmount: 0, isNew: true },
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

  // setting checkbox to true sets Amount to 5 - start
  // setting checkbox to false sets Amount to 0 - start
  const handleCellClick = (params: GridCellParams) => {    
    if (params.field !== 'checkMe' || params.cellMode !== 'edit') return;    
    setRows(rows.map((row) => {
      if (row.id === params.id) {
        // checkbox is clicked, but value not updated yet
        const newChecked = params.value ? false : true;
        // set other fields as meeded.
        return {
          ...row,
          checkMe: newChecked,
          checkAmount: newChecked ? 5 : 0
        }
      } else {
        return {...row}
      }
    }))  
  }
  // setting checkbox to true sets Amount to 5 - end
  // setting checkbox to false sets Amount to 0 - end

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
      align: 'right',
      headerAlign: 'right',
      type: 'number',
      editable: true,      
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 999,
            min: 0,
          }}
        />
      ),      
      cellClassName: params => applyFeeCellColor(params.value as number),            
      valueGetter: (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100,
      valueParser: (value) => value.replace('$', ''),
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    // checkbox cell - start
    {
      field: 'checkMe',
      headerName: 'Check',
      type: 'boolean',
      editable: true,
      width: 80,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (value, row) => row.checkMe ? 5 : 0,
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    // checkbox cell - end
    // one field base on value from another - start
    {
      field: 'checkAmount',
      headerName: 'Amount',
      type: 'number',
      width: 100,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value?: number) => currencyFormatter.format(value!),
    },
    // one field base on value from another - end
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
      <h3>Grid 7 (expaning on Grid 6)</h3>
      <p>autoheight</p>
      <p>checkbox cell</p>
      <p>one field base on another</p>
      <p>setting checkbox to true sets Amount to 5</p>
      <p>setting checkbox to false sets Amount to 0</p>
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
        {/* autoheight - start of div props */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* autoheight - end of div props */}
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row" 
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}

            // row updates when user presses [Enter] - start
            processRowUpdate={processRowUpdate}
            // row updates when user presses [Enter] - end

            // header toolbar - start
            slots={{ toolbar: EditToolbar }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            // header toolbar - end

            // hide footer - start
            // hideFooterPagination
            // hideFooterSelectedRowCount
            hideFooter
            // hide footer - end

            onCellClick={handleCellClick}
          />
        </div> {/* autoheight - end div props */}
      </Box>
    </>      
  );
}
