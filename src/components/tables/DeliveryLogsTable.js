import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


const columns = [
  {
    id: 'Device',
    label: 'Device',
    minWidth: 100
  },
  {
    id: 'Message',
    label: 'Message',
    minWidth: 200
  },
  {
    id: 'Source',
    label: 'Source',
    minWidth: 200
  },
  {
    id: 'Extra',
    label: 'Extra',
    minWidth: 200
  },
  {
    id: 'Date',
    label: 'Date',
    minWidth: 200,
  },
  {
    id: 'Time',
    label: 'Time Stamp',
    minWidth: 200,
  },
];


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

export default function StickyHeadTable() {


  // I want thr first sesison to come first, and the firs timestamp of that session to be first in the sesisonId group

  // Filter the data to record a session on the server (Every tiime you call route, a new session begins. So assign that session a new sessionId)
  // And then feed it into the table rows like this: 

  // x = [{
  //   sessionId: String, 
  //   leadingTimeStamp: Number, 
  //   data: [{
  //     Date: Date,
  //     Extra: String,
  //     Source: String,
  //     Message: String, 
  //     Device: String
  //   }, {
  //     /** */
  //   }]
  // }, { /** sessionId: ... */  }]

  // // Now group all x which have the same sessionId like this: 
  // Object.keys(x); 
  // Object.values(x)


  // Nest the tables 

  var dbName;
  const client = sessionStorage.getItem("clientName");
  if (client == 'Hotel Sky') {
    

  } else {
    dbName = 'moron-alert';
  }








  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [rows, setTableData] = React.useState([]);

  // Gets the list of data from MongoDB
  React.useEffect(() => {
    function fetchData() {

    }

    fetchData();

  }, []);





  return (

    <Paper className={classes.root}>

      <TableContainer >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={`tc-${column.id}`}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow key={`tr-${index}`} hover role="checkbox" tabIndex={-1}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align} >
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className={classes.rContainer}>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100, 500, 1000]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />

        </div>

      </TableContainer>


    </Paper>

  );
}