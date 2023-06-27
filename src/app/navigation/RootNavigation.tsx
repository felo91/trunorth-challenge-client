import { BrowserRouter, Navigate, Outlet, Route, RouteProps, Routes } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import CalculatorPage from '../pages/calculator/CalculatorPage';
import { useAppSelector } from '../redux/hooks';
import { selectAuthenticatedUser } from '../redux/slices/auth.slice';
import RecordsPage from '../pages/records/RecordsPage';

const PrivateRoute = ({ ...rest }: RouteProps): React.ReactElement | null => {
  const { token } = useAppSelector(selectAuthenticatedUser);
  return token ? <Outlet /> : <Navigate to="/" />;
};

const RootNavigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/records" element={<RecordsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RootNavigation;
