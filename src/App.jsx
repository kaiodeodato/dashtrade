import React, { useState, useEffect, memo, useCallback, useMemo,Suspense   } from 'react';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from "@mui/material"
import { MyContext } from "../UserContext.js";
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Topbar from "./scenes/global/topbar.jsx";
import Dashboard from "./scenes/dashboard";
import List from "./scenes/list"

import './App.css';

const App = memo(() => {


  const LazyForm = React.lazy(() => import('./scenes/form'));
  const LazyEdit = React.lazy(() => import('./scenes/edit.jsx'));

  const [theme, colorMode] = useMode();
  const [trades, setTrades] = useState([]);
  const [tradesSearch, setTradesSearch] = useState([]);
  const [clientSelect, setClientSelect] = useState(''); 
  const [clientSearch, setClientSearch] = useState(''); 
  const [trickSearch, setTrickSearch] = useState(false); 
  const [personalColors, setPersonalColors] = useState([
    "#e3b17e",
    "#61cdbb",
    "#d8df5e",
    "#b64144",
    "#f3722c",
    "#cd92de",
    "#f8961e",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#ad59c4",
    "#577590",
    "#277da1",
    "#eb51a5",
  ]);
  
  useEffect(() => {
    if (clientSearch) {
      handleSearch();
    } else if (clientSelect && clientSelect !== "All Clients") {
        handleSelect();
    } else {
        fetchTrades();
    }
    setTrickSearch(false)

}, [clientSelect,  trickSearch]);

  const fetchTrades = useCallback(() => {
    axios.get('https://dashapi.kaiodeodato.com/api.php')
      .then(response => {
        setTrades(response.data);
      })
      .catch(error => {
        console.error('Error fetching trades:', error);
      });
  },[]);

  const handleSelect = useCallback(() => {
    setTrades([]);
    if (clientSelect !== '') {
        axios.get(`https://dashapi.kaiodeodato.com/api.php?client_name=${clientSelect}`)
            .then(response => {
                if(response.data.length > 0 ){
                    setTrades(response.data);
                }
                else{
                  setTrades([]);
                }
            })
            .catch(error => {
                console.error('Error fetching trades:', error);
            });
    } else {
      setTrades([]);
    }
  },[clientSearch, clientSelect, trades, trickSearch]);

  const handleSearch = useCallback(() => {
    if (clientSearch !== '' && clientSelect === "") {
        let TempSearchArray = trades.filter((trade) => 
            trade["title_abbr"].toLowerCase() === clientSearch.toLowerCase()
        );
        setTradesSearch(TempSearchArray);
    } else if (clientSearch !== '' && clientSelect !== ""){
      let TempSearchArray = trades.filter((trade) => 
        trade["title_abbr"].toLowerCase() === clientSearch.toLowerCase() && trade["client_name"].toLowerCase() === clientSelect.toLowerCase()
    );
    setTradesSearch(TempSearchArray);
    } 
    else {
        setTradesSearch([]);
    }
},[clientSearch, clientSelect, trades, trickSearch]);

// const handleSearchDebounced = useCallback(
//   _.debounce(() => {
//     if (clientSearch !== '' && clientSelect === '') {
//       let TempSearchArray = trades.filter((trade) =>
//         trade["title_abbr"].toLowerCase() === clientSearch.toLowerCase()
//       );
//       setTradesSearch(TempSearchArray);
//     } else if (clientSearch !== '' && clientSelect !== '') {
//       let TempSearchArray = trades.filter((trade) =>
//         trade["title_abbr"].toLowerCase() === clientSearch.toLowerCase() && 
//         trade["client_name"].toLowerCase() === clientSelect.toLowerCase()
//       );
//       setTradesSearch(TempSearchArray);
//     } else {
//       setTradesSearch([]);
//     }
//   }, 300), // Atraso de 300ms
//   [clientSearch, clientSelect, trades]
// );

const contextValue = useMemo(() => ({
  trades,
  setTrades,
  tradesSearch,
  setTradesSearch,
  personalColors,
  setPersonalColors,
  clientSelect,
  setClientSelect,
  clientSearch,
  setClientSearch,
  trickSearch, 
  setTrickSearch
}), [
  trades,
  setTrades,
  tradesSearch,
  setTradesSearch,
  personalColors,
  setPersonalColors,
  clientSelect,
  setClientSelect,
  clientSearch,
  setClientSearch,
  trickSearch, 
  setTrickSearch
]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
      <MyContext.Provider value={ contextValue }>
          <CssBaseline/>
              <Router>
                <main className='content flex flex-col justify-between h-screen'>
                  <Topbar/>
                    <Routes>
                      <Route path="/" element={<Dashboard/>} />
                      <Route path="/form" element={<Suspense ><LazyForm /></Suspense>} />
                      <Route path="/list" element={<List/>} />
                      <Route path="/edit" element={<Suspense ><LazyEdit /></Suspense>} />
                    </Routes>
                    <div className='flex justify-center items-center bg-gray-500 text-gray-200 p-2 mt-36' >
                    Kaio Deodato © 2024 - All rights reserved.
                    </div>
                </main>
              </Router>
          </MyContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
})

export default App;

