import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import CaseAnalysis from '../pages/CaseAnalysis';
import CaseIssues from '../pages/CaseIssues';
import CaseSearch from '../pages/CaseSearch';
import CaseFinalReview from '../pages/CaseFinalReview';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/case-analysis',
    element: <CaseAnalysis />,
  },
  {
    path: '/case-issues',
    element: <CaseIssues />,
  },
  {
    path: '/case-search',
    element: <CaseSearch />,
  },
  {
    path: '/case-finalreview',
    element: <CaseFinalReview />,
  },
]);

export default router;

