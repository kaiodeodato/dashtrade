import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from "../../UserContext.js";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const AmountDisplay = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { trades } = useContext(MyContext);
    const [ totalTradeAmount, setTotalTradeAmount ] = useState(0);

    useEffect(() => {
        const totalAmount = aggregatedArray.reduce((acc, item) => {
            if(item.trade_amount > 0){
                if (item.trade_status === "v") {
                    acc -= parseFloat(item.trade_amount);
                } else {
                    acc += parseFloat(item.trade_amount);
                }
            }
            return acc;
        }, 0);

        setTotalTradeAmount(totalAmount);
    }, [trades]);

    const aggregatedData = trades.reduce((acc, item) => {
        if (!acc[item.title_abbr]) {
          acc[item.title_abbr] = {
            title_abbr: item.title_abbr,
            trade_amount: 0,
            price_total: 0
          };
        }
        if(item.trade_status === "v"){
            acc[item.title_abbr].trade_amount -= parseFloat(item.trade_amount);
            acc[item.title_abbr].price_total -= parseFloat(item.price_total);
        }else {
            acc[item.title_abbr].trade_amount += parseFloat(item.trade_amount);
            acc[item.title_abbr].price_total += parseFloat(item.price_total);
        }
        return acc;
        }, {});

        const aggregatedArray = Object.values(aggregatedData).filter(item => item.trade_amount > 0);

    return (
        <div className='grid grid-cols-1 justify-between items-center rounded-lg h-36 px-4 shadow-lg' style={{ backgroundColor: colors.primary[100] }}   >
            <div className='flex justify-between items-center w-full text-xl'>
                <h1>Total Investiment</h1>
                <div className='p-1 rounded-full' style={{ backgroundColor: colors.primary[700],color: colors.primary[100]  }}>
                    <ShowChartIcon fontSize="large"/>
                </div>
            </div>
            <div className='flex justify-center items-center gap-6'>
                <h1 className='text-6xl'>{ totalTradeAmount }<span className='text-3xl ml-2 opacity-55'>uni</span></h1>
                <h1 className='text-xl'></h1>
            </div>
        </div>
    );
}

export default AmountDisplay;


