/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
"use client";

// get value with valueGetter (rounds to 2 decimal places)
// parse value with valueParser (strips $)
// format value with valueFormatter (formats as US Dollar)
// https://mui.com/x/react-data-grid/editing/#value-parser-and-value-setter
// https://mui.com/x/react-data-grid/column-definition/#value-formatter

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
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    fee: eaRandomPrice(),
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    fee: eaRandomPrice(),
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    fee: eaRandomPrice(),
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    fee: eaRandomPrice(),
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

export default function Grid6() {
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
        { id, name: '', age: '', role: '', isNew: true },
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
      <h3>Grid 6 (expaning on Grid 4 NOT 5)</h3>
      <p>get value with valueGetter (rounds to 2 decimal places)</p>
      <p>parse value with valueParser (strips $)</p>
      <p>format value with valueFormatter (formats as US Dollar)</p>
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
        />
      </Box>
    </>      
  );
}
