import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import * as yup from 'yup';
import { Formik } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginPage.css';
import { NotificationManager } from 'react-notifications';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAuthenticatedUser, setAuthenticatedUser } from '../../redux/slices/auth.slice';
import { Card } from 'react-bootstrap';
import { useLoginMutation } from '../../services/auth.service';
import { setShowLoader } from '../../redux/slices/general.slice';

const schema = yup.object().shape({
  email: yup.string().required().email('Please enter a valid email'),
  password: yup.string().required().min(3, 'Password must be at least 3 characters'),
});

const LoginPage = () => {
  const [login, { data, error, isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useAppSelector(selectAuthenticatedUser);

  useEffect(() => {
    if (token) navigate('calculator');
  }, [token]);

  useEffect(() => {
    if (data && !error) {
      NotificationManager.success(`Welcome ${data.name}`, 'Authentication Success');
      localStorage.setItem('user', JSON.stringify(data));
      dispatch(setAuthenticatedUser(data));
      navigate('home');
    } else if (error) {
      NotificationManager.error('Error authenticating user, please check your email and password', 'Authentication Error');
    }
  }, [data, error, dispatch]);

  useEffect(() => {
    dispatch(setShowLoader(isLoading));
  }, [isLoading, dispatch]);

  const handleLogin = (formValue: { email: string; password: string; }) => {
    const { email, password } = formValue;
    login({ email, password });
  };

  return (
    <div className="login-wrapper">
      <Formik
        validationSchema={schema}
        onSubmit={handleLogin}
        initialValues={{
          email: '',
          password: '',
        }}
      >
        {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => (
          <Card className="card" style={{ width: '18rem' }}>
            <Card.Title className="title">Login Page</Card.Title>
            <Form className="form" noValidate onSubmit={handleSubmit}>
              <Form.Group as={Col} md="12" controlId="validationFormikEmail">
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control type="text" placeholder="Your email address" name="email" value={values.email} onChange={handleChange} isInvalid={!!errors.email} />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="validationFormik02">
                <Form.Label>Password</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">&#128273;</InputGroup.Text>
                  <Form.Control type="password" placeholder="Your password" name="password" value={values.password} onChange={handleChange} isValid={touched.password && !errors.password} />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button type="submit">Submit form</Button>
            </Form>
          </Card>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
