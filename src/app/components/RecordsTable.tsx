import { useState, useEffect } from "react";
import { Card, Spinner, Table, Pagination } from "react-bootstrap";
import { useTable, usePagination, Column } from "react-table";
import { useGetRecordsQuery } from "../services/record.service";
import { selectRecords, setRecords } from "../redux/slices/record.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Record } from '../redux/slices/record.slice';

interface GenericTableProps {
  columns: Column[];
  useData: any;
  defaultPageSize: number;
  filter?: string;
}

export const GenericTable = ({ columns, useData, defaultPageSize, filter }: GenericTableProps) => {

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [controlledPageCount, setPageCount] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(3);
  const [lastEvaluatedKeys, setLastEvaluatedKeys] = useState<(Record | null)[]>([null]);

  const { data, error, refetch } = useGetRecordsQuery({ filter, lastEvaluatedKey: lastEvaluatedKeys[lastEvaluatedKeys.length - 1] });
  const { data: records, totalItems } = useAppSelector(selectRecords);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    nextPage,
    previousPage,
    state: {
      pageIndex,
      pageSize,
    },
  } = useTable(
    {
      columns,
      data: records ? records : [],
      initialState: {
        pageIndex: 0,
        pageSize: recordsPerPage
      },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination
  );



  //console.log("page: ", page)
  //const { data: result, isLoading} = useData()

  useEffect(() => {
    if (data && !error) {
      dispatch(setRecords({
        data: data.data.records,
        lastEvaluatedKey: data.data.lastEvaluatedKey,
        totalItems: data.data.totalItems
      }));
    } else if (error) console.log(`TableComponent:: Error getting data`, error);
  }, [data, error]);

  useEffect(() => {
    refetch();
  }, [filter, lastEvaluatedKeys, refetch]);


  useEffect(() => {
    if (records) {
      setLoading(false);
      console.log("pageIndex: ", pageIndex);
      setTotal(totalItems ? totalItems : 0);
      setPageCount(totalItems ? Math.floor(totalItems / pageSize) : 0);
    }
  }, [records, pageIndex, pageSize]);

  return (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        {loading ? (
          <Spinner animation="grow" />
        ) : (
          <Table
            hover
            className="user-table align-items-center"
            {...getTableProps()}
          >
            <thead>
              {
                headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {
                      headerGroup.headers.map(column => (
                        <th
                          className="border-bottom"
                          {...column.getHeaderProps()}
                        >
                          {
                            column.render('Header')}
                        </th>
                      ))}
                  </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {
                page.map((row, i) => {
                  prepareRow(row);

                  return (
                    <tr {...row.getRowProps()}>
                      {
                        row.cells.map(cell => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render('Cell')}
                            </td>
                          );
                        })}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        )}
        <Card.Footer
          className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Pagination className="mb-2 mb-lg-0">
            <Pagination.Prev
              disabled={!data || lastEvaluatedKeys.length <= 1}
              onClick={() => {
                setLastEvaluatedKeys(prevKeys => {
                  const newKeys = [...prevKeys];
                  newKeys.pop();
                  return newKeys;
                });
                previousPage();
              }}
            />
            <Pagination.Next
              disabled={!data || !data.data.lastEvaluatedKey}
              onClick={() => {
                setLastEvaluatedKeys(prevKeys => [...prevKeys, data.data.lastEvaluatedKey]);
                nextPage();
              }}
            />
          </Pagination>
          <small className="fw-bold">
            {total} records / page{" "}
            <strong>{pageIndex + 1}</strong> of {pageOptions.length + 1}
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};