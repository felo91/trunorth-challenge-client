import 'bootstrap/dist/css/bootstrap.min.css';
import { useMemo, useState, useEffect } from 'react';
import { Column } from 'react-table';
import { GenericTable } from "../../components/RecordsTable";
import { useDeleteRecordMutation, useGetRecordsQuery } from '../../services/record.service';
import './recordsPage.css';
import { useAppDispatch } from '../../redux/hooks';
import { removeRecord, Record } from '../../redux/slices/record.slice';
import { Button, Modal, Form } from 'react-bootstrap';

const RecordsPage = () => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const [record, setRecord] = useState({} as Record);
  const [filter, setFilter] = useState("");

  const [deleteRecord] = useDeleteRecordMutation();

  const handleModalClose = async () => {
    setShow(false);
    await deleteRecord(`?id=${record.id}&operation_id=${record.operation_id}`);
    dispatch(removeRecord(record.id));
  };

  const handleDelete = (record: any) => {
    setRecord(record as Record);
    setShow(true);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const columns = useMemo<Column[]>(() => [
    { Header: 'Operation ID', accessor: 'operation_id' },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'User Balance', accessor: 'user_balance' },
    { Header: 'Operation Response', accessor: 'operation_response' },
    { Header: 'Date', accessor: 'date' },
    {
      Header: 'Actions', accessor: 'actions', Cell: ({ row }) => (
        <Button variant="warning" onClick={() => handleDelete(row.original)}>Delete</Button>
      )
    }
  ],
    []
  );

  return (
    <>
      <Form.Control type="text" placeholder="Filter records" value={filter} onChange={handleFilterChange} />
      <GenericTable
        columns={columns}
        useData={useGetRecordsQuery}
        defaultPageSize={3}
        filter={filter}
      />
      <Modal show={show}>
        <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}> No </Button>
          <Button variant="primary" onClick={handleModalClose}> Yes </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecordsPage;