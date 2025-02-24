import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

let TSPLIntegrationKey = "";

let intKeyAttr = document.querySelector('script[data-name="tsplscript"]')?.attributes.getNamedItem("data-integration-key");
console.log(intKeyAttr)
if (intKeyAttr !== undefined && intKeyAttr !== null){
  TSPLIntegrationKey = intKeyAttr.value;
  alert("Integration Key : "+TSPLIntegrationKey);
}

const newDiv = document.createElement('div');

// Set some properties
newDiv.id = 'root';

// Append the new div to the body
document.body.appendChild(newDiv);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
