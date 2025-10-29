import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import FactReview from '../pages/FactReview';
import IssueIdentification from '../pages/IssueIdentification';
import CaseResearch from '../pages/CaseResearch';
import FinalReview from '../pages/FinalReview';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/fact-review',
    element: <FactReview />,
  },
  {
    path: '/issue-identification',
    element: <IssueIdentification />,
  },
  {
    path: '/case-research',
    element: <CaseResearch />,
  },
  {
    path: '/final-review',
    element: <FinalReview />,
  },
]);

export default router;

