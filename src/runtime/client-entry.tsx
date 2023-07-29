import { createRoot } from 'react-dom/client';
import { App } from './App';
import siteData from 'docspack:site-data';

function renderInBrowser() {
  const containerEl = document.getElementById('root');
  console.log(siteData);
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(<App />);
}

renderInBrowser();
