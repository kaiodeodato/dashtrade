import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from "../../UserContext.js";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';



const Edit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tradeId = queryParams.get('id');
    const { setTrickSearch   } = useContext(MyContext);

    const [tradeNumber, setTradeNumber] = useState('');
    const [tradeStatus, setTradeStatus] = useState('');
    const [tradeDate, setTradeDate] = useState('');
    const [tradeAmount, setTradeAmount] = useState('');
    const [titleName, setTitleName] = useState('');
    const [titleAbbr, setTitleAbbr] = useState('');
    const [titleCnpj, setTitleCnpj] = useState('');
    const [priceUnit, setPriceUnit] = useState('');
    const [priceTotal, setPriceTotal] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientNumber, setClientNumber] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (tradeId) {
            axios.get(`https://dashapi.kaiodeodato.com/api.php?getById=${tradeId}`)
                .then(response => {
                    const trade = response.data;

                    setTradeNumber(trade[0].trade_number);
                    setTradeStatus(trade[0].trade_status);
                    setTradeDate(trade[0].trade_date);
                    setTradeAmount(trade[0].trade_amount);
                    setTitleName(trade[0].title_name);
                    setTitleAbbr(trade[0].title_abbr);
                    setTitleCnpj(trade[0].title_cnpj);
                    setPriceUnit(trade[0].price_unit);
                    setPriceTotal(trade[0].price_total);
                    setClientName(trade[0].client_name);
                    setClientNumber(trade[0].client_number);

                })
                .catch(error => {
                    console.error('Error fetching trade details:', error);
                });
        }
    }, [tradeId]);

    const handleSubmit = (e) => {
      e.preventDefault();
    
      axios.post(`https://dashapi.kaiodeodato.com/api.php`, {
          password: password,
          action: "update",
          id: tradeId,
          trade_number: tradeNumber,
          trade_status: tradeStatus,
          trade_date: tradeDate,
          trade_amount: tradeAmount,
          title_name: titleName,
          title_abbr: titleAbbr,
          title_cnpj: titleCnpj,
          price_unit: priceUnit,
          price_total: priceTotal,
          client_name: clientName,
          client_number: clientNumber
      })
      .then(response => {
          console.log('Request Sended Successfully:', response.data);
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
          setTrickSearch(true)
      })
      .catch(error => {
        console.log(error)
        toast.error("Error updating trade", {
          position: "top-right"
      })
      });
  };

    return <div className='flex flex-col justify-center items-center'>

        <h1 className='text-4xl mt-10'>Edit</h1>
          <form className='container mx-auto grid grid-cols-1 md:grid-cols-2 justify-center items-center mt-10 gap-2 text-gray-700' 
          onSubmit={handleSubmit}>

            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Trade Number
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="text" 
                placeholder="Trade Number" 
                value={tradeNumber || ''} 
                onChange={(e) => setTradeNumber(e.target.value)} 
                required />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Trade Status
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="text" 
                placeholder="Trade Status" 
                value={tradeStatus || ''} 
                onChange={(e) => setTradeStatus(e.target.value)} 
                required 
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Trade Date
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="date" 
                placeholder="Trade Date" 
                value={tradeDate || ''} 
                onChange={(e) => setTradeDate(e.target.value)} 
                required 
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Trade Amount
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="number" 
                placeholder="Trade Amount" 
                value={tradeAmount || ''} 
                onChange={(e) => setTradeAmount(e.target.value)} 
                required 
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Title Name
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="text" 
                placeholder="Title Name" 
                value={titleName || ''} 
                onChange={(e) => setTitleName(e.target.value)} 
                required 
                />
              </div>
            </div>
              
            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Title Abbr
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="text" 
                placeholder="Title Abbreviation" 
                value={titleAbbr || ''} 
                onChange={(e) => setTitleAbbr(e.target.value)} 
                required 
                />
              </div>
            </div>
              
            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Title CNPJ
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="text" 
                placeholder="Title CNPJ" 
                value={titleCnpj || ''} 
                onChange={(e) => setTitleCnpj(e.target.value)} 
                required 
                />
              </div>
            </div>
            
            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Price Unit
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="number" 
                placeholder="Price Unit" 
                value={priceUnit || ''} 
                onChange={(e) => setPriceUnit(e.target.value)} 
                required 
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Price Total
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="number" 
              placeholder="Price Total" 
              value={priceTotal || ''} 
              onChange={(e) => setPriceTotal(e.target.value)} 
              required 
                />
              </div>
            </div>
              
            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Client Name
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type="text" 
                placeholder="Client Name" 
                value={clientName || ''} 
                onChange={(e) => setClientName(e.target.value)} 
                required 
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Client Number
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                  type="text" 
                  placeholder="Client Number" 
                  value={clientNumber || ''}
                  onChange={(e) => setClientNumber(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6 border border-gray-600 rounded-md">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                  Password
                </label>
              </div>
              <div className="md:w-2/3">
                <input 
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                  type="password" 
                  value={password || ''} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-center items-center mb-6">
              <button className='p-2 text-gray-500 border border-gray-500 rounded-md bg-gray-200 hover:bg-gray-800 hover:text-gray-400 duration-300 md:w-1/3' type="submit">Update Trade</button>
            </div>
          </form>
          <Toaster/>
    </div>
}

export default Edit;