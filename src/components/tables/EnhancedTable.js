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
import TableToolbar from './TableToolbar'
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'

import { makeStyles } from '@material-ui/core/styles';
import GlobalFilter from './GlobalFilter'

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
  handleRowClick,
}) => {



  const columns = React.useMemo(
    () => [
      {
        Header: 'Question',
        accessor: 'question',
      }
    ],
    []
  )



  var baseUrl;
  var apiList;
  try {
    apiList = JSON.parse(sessionStorage.getItem("API"));
    baseUrl = apiList.unanswered_handler;
  } catch (e) {
    console.error(e);
    baseUrl = "https://moron-alert.com"
  }

  const [data, setTableData] = React.useState([]);
  const [tableChanges, setTableChanges] = React.useState(0)

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
          setTableData(qnaData);

          liftTableState({
            tableChanges: tableChanges,
            setTableChanges: setTableChanges,
          })

        });
    }

    fetchData();

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
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox.  Pagination is a problem since this will select all
          // rows even though not all rows are on the current page.  The solution should
          // be server side pagination.  For one, the clients should not download all
          // rows in most cases.  The client should only download data for the current page.
          // In that case, getToggleAllRowsSelectedProps works fine.
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
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

  const removeByIndexs = (array, indexs) =>
    array.filter((_, i) => !indexs.includes(i))

  const deleteUserHandler = event => {
    const newData = removeByIndexs(
      data,
      Object.keys(selectedRowIds).map(x => parseInt(x, 10))
    )
    setData(newData)
  }

  const addUserHandler = user => {
    const newData = data.concat([user])
    setData(newData)
  }

















  // Render the UI for your table
  return (
    <Paper className={classes.root}>

      <TableContainer>

        <TableToolbar
          numSelected={Object.keys(selectedRowIds).length}
          deleteUserHandler={deleteUserHandler}
          addUserHandler={addUserHandler}
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
                  <TableCell style={{ width: 50, height: 50 }}
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
              </TableRow>
            ))}

          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <TableRow hover {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell onClick={() => (console.log("click"))} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>

          <TableFooter>

          </TableFooter>

        </MaUTable>
      </TableContainer>

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
