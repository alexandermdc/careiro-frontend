import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CarrinhoProvider } from './contexts/CarrinhoContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <CarrinhoProvider>
      <App />
    </CarrinhoProvider>
  </HashRouter>
);
