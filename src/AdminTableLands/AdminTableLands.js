import useFetch from "../useFetch";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import LoadingCircle from "../LoadingCircle";
import { useEffect, useMemo, useState } from "react";
import "../TableLands/TableLands.css";
import DeleteRow from "../TableLands/DeleteRow";
import EditRow from "../TableLands/EditRow";
import Analysis from "../TableLands/Analysis";
import edit from "../Icons/edit.svg";
import ColumnFilter from "../ColumnFilter/ColumnFilter";
import SameSelect from "./SameSelect";
import post from "../post";
import "./AdminTableLands.css";
import { Modal } from "react-bootstrap";
import Info from "./Info";
const AdminTableLands = () => {
  const COLUMNS = [
    {
      Header: "Površina",
      accessor: "name",
      Filter: <></>,
    },
    {
      Header: "Proizvođač",
      accessor: "pro",
      Filter: ColumnFilter,
    },
    {
      Header: "Opština",
      accessor: "town",
      Filter: ColumnFilter,
    },
    {
      Header: "Tip",
      accessor: "land_type",
      Filter: ColumnFilter,
    },
    {
      Header: "Kultura",
      accessor: "crop_type",
      Filter: ColumnFilter,
    },
    {
      Header: "Savjetodavac",
      accessor: "advisor",

      Cell: ({ value, row }) => {
        const giveLandToAdvisor = (data) => {
          post("http://127.0.0.1:5000/giveLandToAdvisor", {
            land_id: row.original.id,
            advisor: data,
          }).then(
            () => {
              if (data != null) {
                window.scrollTo(0, 0);
                setShow(true);
              }
            },
            (error) => {
              alert(error);
            }
          );
        };
        return (
          <>
            {isPendingAdvisors && null}
            {!isPendingAdvisors && !errAdvisors && (
              <SameSelect
                rel="preconnect"
                data={allAdvisors}
                handleGetData={(data) => {
                  giveLandToAdvisor(data);
                }}
                placeholder="savjetodavca"
                selected={value === null ? "" : value}
                className="advisorSelect"
              />
            )}
          </>
        );
      },
      Filter: <></>,
    },
    {
      Header: "Radnje",
      accessor: "id",
      Cell: (tableProps) => (
        <div
          className="actionsDiv"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          <Analysis id={tableProps.row.original.id} />
          <Info id={tableProps.row.original.id} />
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
      ),

      Filter: <></>,
    },
  ];

  //States
  const url = "http://127.0.0.1:5000/getAllLands";
  const { data, isPending, error } = useFetch(url);
  const url_1 = "http://127.0.0.1:5000/getAdvisors";
  const {
    data: allAdvisors,
    isPending: isPendingAdvisors,
    error: errAdvisors,
  } = useFetch(url_1);
  const columns = useMemo(() => COLUMNS, [isPendingAdvisors]);
  const [dataTable, setDataTable] = useState([]);
  const [show, setShow] = useState(false);
  let id = 0;
  //Hooks
  useEffect(() => {
    if (!isPending) setDataTable(data);
  }, [isPending]);

  const HandleRowDelete = (rowID) => {
    const result = tableInstance.data.filter((row) => {
      return row.id != rowID;
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
            <table id="adminLandTable" {...getTableProps()}>
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

      {show && (
        <Modal
          animation={false}
          show={show}
          onHide={() => setShow(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body style={{ textAlign: "center" }}>
            Savjetodavacu je uspješno dodjeljena površina.
          </Modal.Body>

          <hr id="modalFooterLine" />
          <div id="modalFooterBtn" style={{ gridTemplateColumns: "1fr" }}>
            <button id="modalCancel" onClick={() => setShow(false)}>
              Potvrdi
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminTableLands;
