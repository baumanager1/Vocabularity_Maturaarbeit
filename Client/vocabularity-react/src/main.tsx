import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import "./styles/colors.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="594148206302-ap6mfrultm3rj0qm45sjk2m27i0o56b6.apps.googleusercontent.com">
  <div className="container-md">
  <div className="row">
    <div className="col">
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </div>
  </div>
</div>
</GoogleOAuthProvider>
);
