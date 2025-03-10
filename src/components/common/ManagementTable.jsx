import React, { useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TablePagination,
} from "@mui/material";
import { theme } from "../../utils/styles";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Loading from "../Loading";

const ManagementTable = ({
  data = [],
  header = [],
  cell = [],
  actions = {},
  emptyMessage = "No data found",
  loading = false,
  stickyHeader = true,
  minWidth = 650,
  containerSx = {},
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <TableContainer
        elevation={0}
        component={Paper}
        sx={{
          backgroundColor: theme.lightGreen,
          borderRadius: "20px",
          maxHeight: "calc(100vh - 210px)",
          // ...containerSx,
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          sx={{ minWidth }}
          aria-label="data table"
        >
          <TableHead>
            <TableRow>
              {header.map((label, index) => (
                <TableCell
                  key={index}
                  sx={{ backgroundColor: theme.lightGreen }}
                >
                  <strong>{label}</strong>
                </TableCell>
              ))}
              {(actions.onView || actions.onEdit || actions.onDelete) && (
                <TableCell
                  sx={{ backgroundColor: theme.lightGreen }}
                  align="right"
                >
                  <strong>Actions</strong>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={header.length + 1} align="center">
                  <Loading />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={header.length + 1} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow key={row.id || rowIndex}>
                    {cell.map((cellFn, colIndex) => {
                      let value = cellFn(row);
                      return (
                        <TableCell key={colIndex}>{value || "-"}</TableCell>
                      );
                    })}
                    {(actions.onView || actions.onEdit || actions.onDelete) && (
                      <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                        {actions.onDelete && (
                          <Button
                            onClick={() => actions.onDelete(row)}
                            sx={{
                              backgroundColor: theme.green,
                              borderRadius: 100,
                              height: 34,
                              textTransform: "none",
                            }}
                            variant="contained"
                          >
                            <TrashIcon className="size-5" />
                            <span className="ms-1.5 mt-0.5">Delete</span>
                          </Button>
                        )}
                        {actions.onEdit && (
                          <Button
                            onClick={() => actions.onEdit(row)}
                            sx={{
                              backgroundColor: theme.green,
                              borderRadius: 100,
                              height: 34,
                              textTransform: "none",
                            }}
                            variant="contained"
                          >
                            <PencilSquareIcon className="size-5" />
                            <span className="ms-1.5 mt-0.5">Edit</span>
                          </Button>
                        )}
                        {actions.onView && (
                          <Button
                            onClick={() => actions.onView(row)}
                            sx={{
                              backgroundColor: theme.green,
                              borderRadius: 100,
                              height: 34,
                              textTransform: "none",
                            }}
                            variant="contained"
                          >
                            <EyeIcon className="size-5" />
                            <span className="ms-1.5 mt-0.5">
                              {row.formattedRecipients
                                ? `View ${row.formattedRecipients.length} Recipients`
                                : "View"}
                            </span>
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          marginTop: 1,
        }}
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ManagementTable;
