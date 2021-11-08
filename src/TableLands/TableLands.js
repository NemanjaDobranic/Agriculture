import useFetch from "../useFetch";
import ReactSession from "react-client-session/dist/ReactSession";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import LoadingCircle from "../LoadingCircle";
import { useEffect, useMemo } from "react";
import { useStateIfMounted } from "use-state-if-mounted";
import "./TableLands.css";
import Search from "./Search";
import DeleteRow from "./DeleteRow";
import EditRow from "./EditRow";
import Analysis from "./Analysis";
import "./ProSavjTable.css";
import edit from "../Icons/edit.svg";
const TableLands = () => {
  const COLUMNS = [
    {
      Header: "Površina",
      accessor: "name",
    },
    {
      Header: "Veličina",
      accessor: "size",
      Cell: ({ value }) => {
        return Math.round(value * 100) / 100;
      },
    },
    {
      Header: "Tip",
      accessor: "type",
    },
    {
      Header: "Kultura",
      accessor: "crop",
    },
    {
      Header: "Očekivani prinos",
      accessor: "expected_yield",
      Cell: ({ value }) => {
        return Math.round(value * 100) / 100;
      },
    },
    {
      Header: "Ostvareni prinos",
      accessor: "realized_yield",
      Cell: ({ value }) => {
        return Math.round(value * 100) / 100;
      },
    },
    {
      Header: "Mjesto",
      accessor: "place",
    },
    {
      Header: "Gard",
      accessor: "naziv",
    },
    {
      Header: "Radnje",
      accessor: "id",
      Cell: (tableProps) => (
        <>
          {role == "pro" && (
            <div className="actionsDiv">
              <Analysis id={tableProps.row.original.id} />
              <EditRow
                image={edit}
                url={`/home/editLand/${tableProps.row.original.id}`}
                tooltip="Izmjena površine"
              />
              <DeleteRow
                url="http://127.0.0.1:5000/deleteLand"
                id={tableProps.row.original.id}
                HandleRowDelete={HandleRowDelete}
              />
            </div>
          )}
          {role == "savj" && <Analysis id={tableProps.row.original.id} />}
        </>
      ),
    },
  ];

  //States
  const email = ReactSession.get("email");
  const role = ReactSession.get("role");
  const columns = useMemo(() => COLUMNS, []);
  const [dataTable, setDataTable] = useStateIfMounted([]);
  const url = "http://127.0.0.1:5000/getTableData?email=" + email;
  const { data, isPending, error } = useFetch(url);

  //Hooks
  useEffect(() => {
    if (!isPending) {
      setDataTable(data);
    }
  }, [isPending]);

  const HandleRowDelete = (rowID) => {
    const result = tableInstance.data.filter((row) => {
      return row.id != rowID;
    });
    setDataTable(result);
  };

  const tableInstance = useTable(
    {
      columns: columns,
      data: dataTable,
    },
    useGlobalFilter,
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
    setGlobalFilter,
  } = tableInstance;

  tableInstance.autoResetPage = false;
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <div>
      {isPending && <LoadingCircle />}
      {error && <p>{error}</p>}
      {!isPending && !error && (
        <>
          <Search filter={globalFilter} setFilter={setGlobalFilter} />
          <div id="proSavjTable" className="wrapper fadeInDown">
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
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

export default TableLands;
