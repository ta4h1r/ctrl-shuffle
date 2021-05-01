import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import MaUTable from '@material-ui/core/Table'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TablePaginationActions from './TablePaginationActions'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Paper from '@material-ui/core/Paper';
import TableToolbar from './TableToolbar';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';

import { IconButton, Snackbar } from '@material-ui/core';
import QnaDialogue from '../dialog/EditQnaDialog';

import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';

import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'

import { makeStyles } from '@material-ui/core/styles';
import GlobalFilter from './GlobalFilter'
import { NativeBuffer } from 'mongoose'

import DeleteAlertDialog from '../dialog/DeleteAlertDialog';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    width: '100%',
    // borderWidth: '1px', borderStyle: 'solid', borderColor: 'red',
    position: 'relative',
    marginBottom: theme.spacing(2),


    rContainer: {
      height: '15%',
      width: '100%',
      position: 'relative',
      display: 'flex',
      flexGrow: 1,
      flexWrap: 'wrap',
      // topPadding: theme.spacing(2),
      // borderWidth: '1px', borderStyle: 'solid', borderColor: 'white',
    },
    '& .MuiTableContainer-root': {
      width: "100%",
      position: 'relative',
      display: 'flex',
      flexGrow: 1,
      flexWrap: 'wrap',
      // borderWidth: '1px', borderStyle: 'solid', borderColor: 'blue',
    },

  },

}));



const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} />
      </>
    )
  }
)

const EnhancedTable = ({
  // setData,
  skipPageReset,
  liftTableState,
  dialogProps,
  // handleRowClick,
}) => {



  const columns = React.useMemo(
    () => [
      {
        Header: 'Intent',
        accessor: 'intent',
      },
      {
        Header: 'Questions',
        accessor: 'questions',
      },
      {
        Header: 'Answers',
        accessor: 'answers',
      },
      {
        Header: 'Modified',
        accessor: 'create_date',
      }
    ],
    []
  )



  var baseUrl;
  var apiList;
  try {
    apiList = JSON.parse(sessionStorage.getItem("API"));
    baseUrl = apiList.web_ui_handler;
  } catch (e) {
    console.error(e);
    baseUrl = "https://moron-alert.com"
  }


  const handleRowClick = (row) => {
    // console.log(row);
    // row.toggleRowSelected(!row.isSelected)
  }

  const handleRowEditClick = (rowIndex) => {
    const absoluteRowIndex = rowIndex + pageSize * pageIndex;
    setOpen(true);
    setRowData(data[absoluteRowIndex]);
  }

  const handleRowDeleteClick = (rowIndex) => {
    setIntentToDelete(data[rowIndex].intent);
    setShowDeleteAlertDialog(true);
  }

  function onDelete(ev) {
    ev.preventDefault();  //to stop the form submitting
    showAlert('updating');
    const originalIntent = intentToDelete;
    console.log(originalIntent); 
    axios.delete(`${baseUrl}/${originalIntent}`, null)
      .then(() => {
        fetchData()
        showAlert('deleteSuccess');
      })
      .catch(() => {
        showAlert('failed')
      });

    closeDeleteAlertDialog();
  }

  function closeDeleteAlertDialog() {
    setShowDeleteAlertDialog(false);
  }


  function fetchData() {
    fetch(baseUrl, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((returnData) => {

        let qnaData = returnData.data;
        setTableChanges(qnaData);
        setTableChanges(tableChanges + 1)
        showAlert('deleteSuccess');
      });
  }

  function showAlert(type) {
    handleCloseSnackbar();
    switch (type) {
      case 'failed':
        setSnackbarState({
          showFailedUpdateAlert: true
        })
        break;
      case 'updating':
        setSnackbarState({
          showUpdatingAlert: true
        })
        break;
      case 'updated':
        setSnackbarState({
          showUpdatedAlert: true
        })
        break;
      case 'deleteSuccess':
        setSnackbarState({
          showDeleteSuccessAlert: true
        })
        break;
    }
  }

  function handleCloseSnackbar() {
    setSnackbarState({
      showDeleteSuccessAlert: false,
      showUpdatedAlert: false,
      showUpdatingAlert: false,
      showFailedUpdateAlert: false,
    })
  }

  const [snackbarState, setSnackbarState] = React.useState({
    showDeleteSuccessAlert: false,
    showUpdatedAlert: false,
    showUpdatingAlert: false,
    showFailedUpdateAlert: false,
  })
  const [data, setTableData] = React.useState([]);
  const [tableChanges, setTableChanges] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState([]);

  const [intentToDelete, setIntentToDelete] = React.useState('');
  const [deleteMessage, setDeleteMessage] = React.useState('If an intent is deleted, all associated question and answer data will be lost. Proceed?')
  const [showDeleteAlertDialog, setShowDeleteAlertDialog] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // Gets the list of qna data
  React.useEffect(() => {
    function fetchData() {
      fetch(baseUrl, {
        method: "get",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((returnData) => {

          let qnaData = returnData.data;
          let sortedtQnAData = sortByKey(qnaData, "create_date");
          setTableData(sortedtQnAData.reverse());

          liftTableState({
            tableChanges: tableChanges,
            setTableChanges: setTableChanges,
          })

        });
    }

    fetchData();

    function sortByKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

  }, [tableChanges]);




  const classes = useStyles();














  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        // {
        //   id: 'selection',
        //   // The header can use the table's getToggleAllRowsSelectedProps method
        //   // to render a checkbox.  Pagination is a problem since this will select all
        //   // rows even though not all rows are on the current page.  The solution should
        //   // be server side pagination.  For one, the clients should not download all
        //   // rows in most cases.  The client should only download data for the current page.
        //   // In that case, getToggleAllRowsSelectedProps works fine.
        //   Header: ({ getToggleAllRowsSelectedProps }) => (
        //     <div>
        //       <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        //     </div>
        //   ),
        //   // The cell can use the individual row's getToggleRowSelectedProps method
        //   // to render a checkbox
        //   Cell: ({ row }) => (
        //     <div>
        //       <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        //     </div>
        //   ),
        // },
        ...columns,
      ])
    }
  )

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setPageSize(Number(event.target.value))
  }

  const handleMultipleDeleteClick = (rowIndexes) => {
    showAlert('updating');

    console.log(rowIndexes);

    var qs = [];
    for (var i = 0, n = rowIndexes.length; i < n; i++) {
      qs.push(data[rowIndexes[i]].question);

      //Removing empty strings 
      var filtered_qs = qs.filter(function (el) {
        return el != "";
      });

    }

    console.log(qs)

    const requestData = {
      questions: filtered_qs,
    }

    console.log(requestData)

    axios.delete(`${baseUrl}`, {
      data: requestData,
    })
      .then(() => {
        fetchData()
      })
      .catch((err) => {
        console.error(err);
        showAlert('failed')
      });

  }

  const deleteMultipleHandler = event => {
    var rowsToDelete = Object.keys(selectedRowIds);
    for (var i = 0, n = rowsToDelete.length; i < n; i++) {
      try {
        rowsToDelete[i] = (Number(rowsToDelete[i]));
      } catch (e) {
        console.log(e)
        showAlert('failed');
      }
    }
    handleMultipleDeleteClick(rowsToDelete)
  }


















  // Render the UI for your table
  return (
    <Paper className={classes.root}>

      <TableContainer>

        <TableToolbar
          numSelected={Object.keys(selectedRowIds).length}
          deleteHandler={deleteMultipleHandler}
          // addUserHandler={addUserHandler}
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}

          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}

          data={data}
        />

        <div className={classes.rContainer}>
          <TablePagination
            rowsPerPageOptions={[
              10,
              20,
              50,
              { label: 'All', value: data.length },
            ]}
            colSpan={0}
            count={data.length}
            rowsPerPage={pageSize}
            page={pageIndex}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </div>

        <MaUTable {...getTableProps()}>

          <TableHead >
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell style={{ width: 50 }}
                    {...(column.id === 'selection'
                      ? column.getHeaderProps()
                      : column.getHeaderProps(column.getSortByToggleProps()))}
                  >
                    {column.render('Header')}
                    {column.id !== 'selection' ? (
                      <TableSortLabel
                        active={column.isSorted}
                        // react-table has a unsorted state which is not treated here
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                      />
                    ) : null}
                  </TableCell>
                ))}
                <TableCell style={{ width: 50 }}>Edit </TableCell>
                <TableCell style={{ width: 50 }} >Delete</TableCell>
              </TableRow>
            ))}

          </TableHead>
         
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <TableRow onClick={() => handleRowClick(row)} hover {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell style={{ width: 500 }} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}

                  <TableCell style={{ width: 50 }}>
                    <IconButton
                      onClick={() => handleRowEditClick(row.index)}
                      color='primary'
                      aria-label="delete">
                      <EditIcon />
                    </IconButton>

                  </TableCell>
                  <TableCell style={{ width: 50 }}>
                    <IconButton
                      onClick={() => handleRowDeleteClick(row.index)}
                      color='secondary'
                      aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>


                </TableRow>
              )
            })}
          </TableBody>

          <TableFooter>

          </TableFooter>

        </MaUTable>
      </TableContainer>


      <QnaDialogue setTableData={setTableData} tableChanges={tableChanges} setTableChanges={setTableChanges} open={open} handleClose={handleClose} rowData={rowData} baseUrl={baseUrl} />

      <DeleteAlertDialog deleteMessage={deleteMessage} handleDelete={onDelete} showDialog={showDeleteAlertDialog} handleClose={closeDeleteAlertDialog} />


      <Snackbar open={snackbarState.showUpdatingAlert} onClose={handleCloseSnackbar}>
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
                            Updating data...
                    </Alert>
      </Snackbar>
      <Snackbar open={snackbarState.showDeleteSuccessAlert} autoHideDuration={2000} onClose={handleCloseSnackbar}>
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
                            Successfully deleted.
                    </Alert>
      </Snackbar>
      <Snackbar open={snackbarState.showUpdatedAlert} autoHideDuration={2000} onClose={handleCloseSnackbar}>
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
                            Successfully updated.
                    </Alert>
      </Snackbar>
      <Snackbar open={snackbarState.showFailedUpdateAlert} autoHideDuration={2000} onClose={handleCloseSnackbar}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
                            Failed to update.
                    </Alert>
      </Snackbar>

    </Paper>

  )
}

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  // updateMyData: PropTypes.func.isRequired,
  // setData: PropTypes.func.isRequired,
  // skipPageReset: PropTypes.bool.isRequired,
}

export default EnhancedTable
