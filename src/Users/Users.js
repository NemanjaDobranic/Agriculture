import useFetch from "../useFetch";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import LoadingCircle from "../LoadingCircle";
import { useEffect, useMemo } from "react";
import { useStateIfMounted } from "use-state-if-mounted";
import "../TableLands/TableLands.css";
import "./UsersTable.css";
import DeleteRow from "../TableLands/DeleteRow";
import ColumnFilter from "../ColumnFilter/ColumnFilter";
import EditRow from "../TableLands/EditRow";
import user from "../Icons/edit-user.svg";
import AdminAddLand from "./AdminAddLand";

const Users = () => {
  const COLUMNS = [
    {
      Header: "Email",
      accessor: "email",
      Filter: ColumnFilter,
    },

    {
      Header: "Radnje",
      accessor: "user_type",
      Cell: (tableProps) => (
        <div className="actionsDiv">
          <EditRow
            image={user}
            url={`/home/editUser/${tableProps.row.original.email}`}
            tooltip="Izmjena korisnika"
          />
          {tableProps.row.original.user_type === "pro" && (
            <AdminAddLand id={tableProps.row.original.email} />
          )}

          <DeleteRow
            url="http://127.0.0.1:5000/deleteUser"
            id={tableProps.row.original.email}
            role={tableProps.row.original.user_type}
            HandleRowDelete={HandleRowDelete}
          />
        </div>
      ),
      Filter: <></>,
    },
  ];

  //States
  const { data, isPending, error } = useFetch(
    "http://127.0.0.1:5000/getAllUsers"
  );
  const columns = useMemo(() => COLUMNS, []);
  const [dataTable, setDataTable] = useStateIfMounted([]);
  let id = 0;
  //Hooks
  useEffect(() => {
    if (!isPending) setDataTable(data);
  }, [isPending]);

  const HandleRowDelete = (rowID) => {
    const result = tableInstance.data.filter((row) => {
      return row.email != rowID;
    });
    setDataTable(result);
  };

  //Functions
  const getNextId = () => {
    id += 1;
    return id;
  };

  const tableInstance = useTable(
    {
      columns: columns,
      data: dataTable,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    setPageSize,
    state,
  } = tableInstance;

  const { pageIndex, pageSize } = state;
  return (
    <div>
      {isPending && <LoadingCircle />}
      {error && <p>{error}</p>}
      {!isPending && !error && (
        <>
          <div className="wrapper fadeInDown">
            <table id="usersTable" {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th scope="col" key={getNextId()}>
                        <div className="thUsers">
                          {" "}
                          <div
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <u> &darr;</u>
                                ) : (
                                  <u> &uarr;</u>
                                )
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell, index) => {
                        return (
                          <td
                            data-label={columns[index].Header}
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="TableBottomDiv">
              <button
                className="tableButton"
                onClick={() => {
                  previousPage();
                }}
                disabled={!canPreviousPage}
              >
                Prethodna
              </button>
              <span id="spanPageSize">
                Stranica{" "}
                <strong>
                  {pageIndex + 1} od {pageOptions.length}
                </strong>
              </span>
              <button
                className="tableButton"
                onClick={() => {
                  nextPage();
                }}
                disabled={!canNextPage}
              >
                Naredna
              </button>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
              >
                {[10, 25, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} površina
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
