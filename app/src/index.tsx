import React    from "react";
import ReactDOM from "react-dom/client";
import App      from "./Components/App";

const domNode = document.getElementById('app');
if(domNode){
  const root = ReactDOM.createRoot(domNode);
  root.render(<App />);
}else{
  console.log("Failed to get element by ID `app`.")
};