import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from "../../UserContext.js";
import { Link,useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TotalMoneySelection from '../components/TotalMoneySelection.jsx';

const List = () => {
    const { trades, setTrades, tradesSearch, setTradesSearch, setClientSearch   } = useContext(MyContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const [tradeToDelete, setTradeToDelete] = useState([])
    const [soldTrade, setSoldTrade] = useState({ sold_amount: 0, sold_unit_price: 0 })
    const [ profit, setProfit] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {

        if (tradesSearch.length > 0) {
            setSelectedRows([...tradesSearch]);
        } else {
            setSelectedRows([]);
        }
        setProfit("")
        setSoldTrade({ sold_amount: 0, sold_unit_price: 0 })
    }, [tradesSearch]);
    
    
    const handleDelete = () => {
        var id = tradeToDelete.id;
        if (password !== '') {
            const requestBody = {
                id: tradeToDelete.id,
                password: password
            };
    
            axios.delete(`https://dashapi.kaiodeodato.com/api.php?deleteId=${id}`, { data: requestBody })
                .then(response => {
                    setTrades(prevTrades => {
                        const updatedTrades = prevTrades.filter(trade => trade.id !== id);
                        return updatedTrades;
                    });
    
                    setSelectedRows(prevSelectedRows => {
                        const updatedSelectedRows = prevSelectedRows.filter(item => item.id !== id);
                        return updatedSelectedRows;
                    });

                    if(response.data.message){
                            toast.success(response.data.message, {
                                position: "top-right"
                            })
                            setTimeout(() => {
                              navigate("/list");
                            }, 1500);
                      }else{
                        toast.error("This didn't work.", {
                            position: "top-right"
                        })
                      }
                })
                .catch(error => {
                    console.error('Error catch:', error);
                    toast.error("Error Delete catch.", {
                        position: "top-right"
                    })
                });
                setTradeToDelete([]);
        } else {
            console.log("Por favor, insira a senha para excluir.");
            setTradeToDelete([]);
        }
    }

    const handleConfirmDelete = () => {
        handleDelete();
        handleCloseModal();
        setPassword('');
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'trade_number', headerName: 'Trade Number', width: 100 },
        { field: 'trade_status', headerName: 'Trade Status', width: 100 },
        { field: 'trade_date', headerName: 'Trade Date', width: 100 },
        { field: 'trade_amount', headerName: 'Trade Amount', width: 130 },
        { field: 'title_name', headerName: 'Title Name', width: 130 },
        { field: 'title_abbr', headerName: 'Title Abbreviation', width: 130 },
        { field: 'title_cnpj', headerName: 'Title CNPJ', width: 130 },
        { field: 'price_unit', headerName: 'Price Unit', width: 80 },
        { field: 'price_total', headerName: 'Price Total', width: 80 },
        { field: 'client_name', headerName: 'Client Name', width: 130 },
        { field: 'client_number', headerName: 'Client Number', width: 130 },
        {
            field: 'actionSelect',
            headerName: 'Selected',
            width: 100,
            renderCell: (params) => {
                const isSelected = selectedRows.some(row => row.id == params.row.id);
                //    console.log(`Row ID: ${params.row.id}, isSelected: ${isSelected}`);
                return (
                    <button style={{ color: colors.blueAccent[500] }} className='ml-2 hover:scale-150 duration-300' 
                        onClick={() => handleSelectionChange(params.row.id)}>
                        {isSelected ? <RemoveIcon/> : <AddIcon/>}
                    </button>
                );
            },
        },
        {
            field: 'actionDelete',
            headerName: 'Delete',
            width: 100,
            renderCell: (params) => (
                <button style={{ color: colors.redAccent[500] }} className='ml-2 hover:scale-150 duration-300' 
                onClick={() => handleOpenModal(params.row)}><DeleteOutlineIcon/></button>
            ),
        },
        {
            field: 'actionUpdate',
            headerName: 'Update',
            width: 100,
            renderCell: (params) => (
                <Link to={`/edit?id=${params.row.id}`} >
                    <button style={{ color: colors.greenAccent[500] }} className='ml-2 hover:scale-150 duration-300'><EditIcon/></button>
                </Link>
                
            ),
        },
    ];

    const handleSelectionChange = (id) => {
        setSelectedRows(prevSelectedRows => {
            const isRowSelected = prevSelectedRows.some(row => row.id == id);
            if (isRowSelected) {
                return prevSelectedRows.filter(row => row.id != id);
            } else {
                const selectedTrade = trades.find(trade => trade.id == id);
                return selectedTrade ? [...prevSelectedRows, selectedTrade] : prevSelectedRows;
            }
        });
    };

    // console.log(tradeToDelete);
    const handleOpenModal = (trade) => {
        setTradeToDelete(trade)
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCleanSearch = () => {
        setTradesSearch([]);
        setClientSearch('')
    };

    const aggregatedData = selectedRows.reduce((acc, item) => {
        if (!acc[item.title_abbr]) {
            acc[item.title_abbr] = {
                title_abbr: item.title_abbr,
                total_trade_amount: 0,
                total_price_bought: 0,
                total_price_sold: 0,
                profit: 0 
            };
        }
        if (item.trade_status === "c") {
            acc[item.title_abbr].total_trade_amount += parseFloat(item.trade_amount);
            acc[item.title_abbr].total_price_bought += parseFloat(item.price_total);
        } else if (item.trade_status === "v") {
            acc[item.title_abbr].total_price_sold += parseFloat(item.price_total);
        }
        return acc;
    }, {});
    
    const aggregatedArray = Object.values(aggregatedData);

    const allTitleAbbrSame = selectedRows.every(row => row.title_abbr === selectedRows[0].title_abbr);

    aggregatedArray.forEach(item => {
        item.profit = Number((item.total_price_sold - item.total_price_bought).toFixed(2));

        if(item.total_price_bought !== 0 && item.total_trade_amount !== 0){
            item.weighted_average_price = Number((item.total_price_bought / item.total_trade_amount).toFixed(2));
        } else {
            item.weighted_average_price = 0;
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const soldAmount = soldTrade.sold_amount;
        const sold_unit_price = soldTrade.sold_unit_price;

        if (!isNaN(soldAmount) && !isNaN(sold_unit_price)) {
            if (aggregatedArray.length > 0 && typeof aggregatedArray[0].weighted_average_price === 'number') {
                const weighted_average_price = aggregatedArray[0].weighted_average_price;
                let CurrentProfit = (sold_unit_price - weighted_average_price) * soldAmount;
                setProfit(CurrentProfit.toFixed(2));

                toast.success("Success", {
                    position: "top-right"})

            }else {
                console.error("Invalid weighted_average_price or aggregatedArray is empty.");
                toast.error("Invalid Data", {
                    position: "top-right"
                });
            }

        } else {
            console.error("sold_amount or sold_unit_price is not a valid number.");
            toast.error("Invalid Values", {
                position: "top-right"
            });
        }
    };

    return  (
        <div className='flex flex-col justify-center items-center mt-10'>
            <div style={{ height: "auto", width: 'auto' }}>
            {trades.length > 0 ? (
                <Accordion defaultExpanded style={{ backgroundColor: colors.primary[100], borderRadius:"10px" }}>
                    <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography>List Trades</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DataGrid
                            key={trades.map(trade => trade.id).join('-') + selectedRows.map(row => row.id).join('-')}
                            style={{ backgroundColor: colors.primary[100] }}
                            rows={trades}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                    pageSize: 10}},
                                }}
                                pageSizeOptions={[5, 10, 25]}
                        />
                    </AccordionDetails>
                </Accordion>
                ) : (
                    <div className='loading'>
                    </div>
            )}
            </div>
            <div className='mt-10' style={{ height: "auto", width: 'auto' }}>
            {selectedRows.length > 0 &&
            <div>
                <Accordion defaultExpanded style={{ backgroundColor: colors.primary[100], borderRadius:"10px" }}>
                    
                    <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography>Selected Items</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <div className='flex flex-col justify-center items-end'>
                            <div style={{ height: "auto", width: 'auto' }}>
                                <DataGrid
                                    key={selectedRows.map(row => row.id).join('-')}
                                    style={{ backgroundColor: colors.primary[100] }}
                                    rows={selectedRows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                            pageSize: 10}},
                                        }}
                                        pageSizeOptions={[5, 10, 25]}
                                />
                            </div>
                            <button 
                                type="button" 
                                className="mt-5 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-500 focus:z-10 focus:ring-4 focus:ring-gray-100" 
                                onClick={handleCleanSearch}>
                                Clean
                            </button>
                        </div>
                    
                    </AccordionDetails>
                </Accordion>

                { allTitleAbbrSame &&
                <div className='grid grid-cols-5 gap-3 mt-10'>
                    <div className='col-span-1'>
                        <TotalMoneySelection title="Total Bought Value" value={(aggregatedArray[0].total_price_bought).toFixed(2)} />
                    </div>
                    <div className='col-span-1 ' >
                        <TotalMoneySelection 
                        textColor={aggregatedArray[0].total_price_sold < aggregatedArray[0].total_price_bought ? "text-red-500" : "text-green-600"} 
                        title="Total Sale Value" value={ (aggregatedArray[0].total_price_sold).toFixed(2) }  />
                    </div>
                    <div className='col-span-1'>
                        <TotalMoneySelection title="buying weighted average" value={aggregatedArray[0].weighted_average_price}  />
                    </div>
                    <div className='col-span-1'>
                        <TotalMoneySelection 
                        textColor={soldTrade.sold_unit_price != 0 ? (soldTrade.sold_unit_price < aggregatedArray[0].weighted_average_price ? "text-red-500" : "text-green-600") : "text-gray-500"}
                        title="Profit" value={profit ? profit : "?"} />
                    </div>
                    <div className='col-span-1'>
                        <TotalMoneySelection title="TAX" value={profit ? (profit * 0.2).toFixed(2) : "?"} />
                    </div>
                    <div className='col-span-5'>
                        <form className="grid grid-cols-5 col-span-4 gap-5 mx-auto rounded-lg h-324 px-4 shadow-lg p-4" onSubmit={handleSubmit} style={{ backgroundColor: colors.primary[100] }} >
                            <div className="col-span-2 mb-2">
                                <label htmlFor="email" className=" block mb-2 text-sm font-medium text-gray-500">Trade Amount</label>
                                <input 
                                type="text" 
                                className="rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="200" 
                                required 
                                onChange={(e) => setSoldTrade(prev => ({
                                    sold_unit_price: prev.sold_unit_price,
                                    sold_amount : e.target.value
                                }))}
                                />
                            </div>
                            <div className="col-span-2 mb-2">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-500">Unit Price</label>
                                <input type="text" 
                                className="rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="30.56"
                                required 
                                onChange={(e) => setSoldTrade(prev => ({
                                    sold_unit_price: e.target.value,
                                    sold_amount : prev.sold_amount
                                }))}
                                />
                            </div>
                           
                            <button type="submit" 
                            className="col-span-1 mt-5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-500 focus:z-10 focus:ring-4 focus:ring-gray-100">Calculate</button>
                        </form>
                    </div>
                </div>
                }

            </div>
            }           
        </div>
        
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className='flex justify-center items-center h-screen'>
                    <div className='modal bg-red-500 p-6 rounded-md flex flex-col justify-center items-center gap-3'>
                        <h2 id="modal-title">Are you sure you want to delete?</h2>
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='flex gap-5'>
                            <button className='p-2 text-primary-500 border border-gray-300 rounded-md hover:bg-gray-200 hover:text-red-500 duration-300' 
                            onClick={handleConfirmDelete}>Confirm</button>
                            <button className='p-2 text-primary-500 border border-gray-300 rounded-md hover:bg-gray-200 hover:text-red-500 duration-300' 
                            onClick={handleCloseModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>
        <Toaster/>
    </div>
    )
}

export default List;
