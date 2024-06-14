import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from "../../UserContext.js";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { useTheme } from "@mui/material";
import { tokens } from "../theme.js";

const DifferentStocks = () => {
    const { trades} = useContext(MyContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const aggregatedData = trades.reduce((acc, item) => {
        if (!acc[item.title_abbr]) {
          acc[item.title_abbr] = {
            title_abbr: item.title_abbr,
            price_unit: item.price_unit,
            trade_amount: 0,
          };
        }
        if(item.trade_status === "v"){
            acc[item.title_abbr].trade_amount -= parseFloat(item.trade_amount);
        }else {
            acc[item.title_abbr].trade_amount += parseFloat(item.trade_amount);
        }
        
        return acc;
        }, {});

    // const aggregatedArray = Object.values(aggregatedData).filter(item => item.trade_amount > 0);
    const aggregatedArray = Object.values(aggregatedData)
    //  console.log(aggregatedArray)
    return (
        <div className='grid grid-cols-1 justify-between items-center rounded-lg h-36 px-4 shadow-lg' style={{ backgroundColor: colors.primary[100] }}   >
            <div className='flex justify-between items-center w-full text-xl'>
                <h1>Different Stocks</h1>
                <div className='p-1 rounded-full' style={{ backgroundColor: colors.primary[700],color: colors.primary[100]  }}>
                    <EqualizerIcon fontSize="large"/>
                </div>
            </div>
            <div className='flex justify-center items-center gap-6'>
                <h1 className='text-6xl'>{ aggregatedArray.length }<span className='text-3xl ml-2 opacity-55'>stock types</span></h1>
                <h1 className='text-xl'></h1>
            </div>
        </div>
    );
}

export default DifferentStocks;


