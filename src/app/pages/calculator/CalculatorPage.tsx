import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectOperationResult, selectOperations, setOperation, setOperations } from '../../redux/slices/operation.slice';
import { useOperationMutation, useOperationsQuery } from '../../services/operation.service';
import { NotificationManager } from 'react-notifications';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import './calculatorPage.css';

export type FetchBaseQueryError = {
  status: 'FETCH_ERROR';
  data: { message: string; status: string; };
  error: string;
};

const isFetchBaseQueryErrorType = (error: any): error is FetchBaseQueryError => 'status' in error;

const CalculatorPage = () => {
  const dispatch = useAppDispatch();
  const [performOperation, { data, error }] = useOperationMutation();
  const [inputsNeeded, setInputsNeeded] = useState(2);
  const { operationResult, userBalance } = useAppSelector(selectOperationResult);
  const { data: operationsData, error: operationsError } = useOperationsQuery();

  const operations = useAppSelector(selectOperations);

  useEffect(() => {
    if (data && !error) {
      dispatch(
        setOperation({
          operationResult: data.data.operation_response,
          userBalance: data.data.user_balance,

        }),
      );
    } else if (error) {
      if (isFetchBaseQueryErrorType(error)) NotificationManager.error(error.data?.message, 'Calculator Error');
      console.log(`LoginPage:: Authentication error`, error);
    }
  }, [data, error, dispatch]);

  useEffect(() => {
    if (operationsData && !operationsError) {
      dispatch(setOperations(operationsData.data),);
    } else if (operationsError) {
      if (isFetchBaseQueryErrorType(operationsError)) { NotificationManager.error(operationsError.data?.message, 'Operations Fetch Error'); }
    }
  }, [operationsData, operationsError, dispatch]);

  const handleOperation = (formValue: { operation_id: string; amount: number[]; }) => {
    performOperation(formValue);
  };

  return (
    <>
      <div className="calculator-wrapper">
        <Formik
          onSubmit={handleOperation}
          initialValues={{
            operation_id: '1',
            amount: Array(inputsNeeded).fill(0),
          }}
        >
          {({ handleSubmit, handleChange, values }) => {
            const handleOperationSelection = (e: any) => {
              if (e.target instanceof HTMLSelectElement) {
                const selectedOperation = operations?.find((operation) => operation.id === e.target.value);
                if (selectedOperation) {
                  setInputsNeeded(selectedOperation.inputsNeeded);
                }
              }
              handleChange(e);
            };

            const handleAmountChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
              const newAmounts = [...values.amount];
              newAmounts[index] = Number(e.target.value);
              if (newAmounts[index] < 99999999) {
                handleChange({
                  target: {
                    name: 'amount',
                    value: newAmounts,
                  },
                });
              }
            };

            return (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="operation">
                  <Form.Label>Operation</Form.Label>
                  <Form.Control as="select" name="operation_id" value={values.operation_id} onChange={handleOperationSelection}>
                    {operations?.map((operation) => (
                      <option key={operation.id} value={operation.id}>
                        {operation.type} (Cost: {operation.cost})
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Label>Amounts</Form.Label>
                  {Array.from({ length: inputsNeeded }).map((_, index) => (
                    <Form.Control
                      key={index}
                      type="number"
                      placeholder={`Enter amount ${index + 1}`}
                      name="amount"
                      value={values.amount[index] || ''}
                      onChange={handleAmountChange(index)}
                    />
                  ))}
                </Form.Group>
                <Button type="submit">Perform Operation</Button>
                {operationResult && <div className="result">Result: {operationResult}</div>}
              </Form>
            );
          }}
        </Formik>
      </div>
      {userBalance && <div className="footer">Account Balance: {userBalance}</div>}
    </>
  );
};

export default CalculatorPage;
