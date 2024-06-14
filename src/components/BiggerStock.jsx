import React, { useContext } from 'react';
import { MyContext } from "../../UserContext.js";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useTheme } from "@mui/material";
import { tokens } from "../theme.js";

const BiggerStock = () => {
    const { trades } = useContext(MyContext);
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

    const aggregatedArray = Object.values(aggregatedData).filter(item => item.trade_amount > 0);

    let maxTrade = null;
    if (aggregatedArray.length > 0) {
        maxTrade = aggregatedArray.reduce((max, current) => {
            const currentAmount = current.trade_amount * current.price_unit;
            return currentAmount > (max.trade_amount * max.price_unit) ? current : max;
        }, aggregatedArray[0]);
    }

    return (
        <div className='grid grid-cols-1 justify-between items-center rounded-lg h-36 px-4 shadow-lg' style={{ backgroundColor: colors.primary[100] }}   >
            <div className='flex justify-between items-center w-full text-xl'>
                <h1>Bigger Stock</h1>
                <div className='p-1 rounded-full' style={{ backgroundColor: colors.primary[700],color: colors.primary[100]  }}>
                    <EmojiEventsIcon fontSize="large"/>
                </div>
            </div>
            <div className='flex justify-center items-center gap-6'>
                <h1 className='text-5xl'>{ maxTrade ? maxTrade.title_abbr : "" }</h1>
                <h1 className='text-xl'></h1>
            </div>
        </div>
    );
}

export default BiggerStock;


