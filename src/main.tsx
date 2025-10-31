import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CarrinhoProvider } from './contexts/CarrinhoContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <CarrinhoProvider>
      <App />
    </CarrinhoProvider>
  </BrowserRouter>
);
