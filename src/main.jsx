import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError
} from "react-router-dom";

import App from './App.jsx'
import Zone from './Page_Zone.jsx'
import Node from './Page_Node.jsx'
import Drone from './Page_Drone.jsx'
import './index.css'

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/zones",
    element: <Zone />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/nodes",
    element: <Node />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/drones",
    element: <Drone />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
