import React, { useContext } from 'react';
import { MyContext } from "../../UserContext.js";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useTheme } from "@mui/material";
import { tokens } from "../theme.js";

const TotalMoney = () => {
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

        const aggregatedArray = Object.values(aggregatedData);
        const totalValue = aggregatedArray.reduce((acc, item) => {
            if (item.trade_amount > 0) {
                return acc + parseFloat(item.price_unit * item.trade_amount);
            } else {
                return acc;
            }
        }, 0);

    return (
        <div className='grid grid-cols-1 justify-between items-center rounded-lg h-36 px-4 shadow-lg' style={{ backgroundColor: colors.primary[100] }}   >
            <div className='flex justify-between items-center w-full text-xl'>
                <h1>Total Investiment</h1>
                <div className='p-1 rounded-full' style={{ backgroundColor: colors.primary[700],color: colors.primary[100]  }}>
                    <AttachMoneyIcon fontSize="large"/>
                </div>
            </div>
            <div className='flex justify-center items-center gap-6'>
                <h1 className='text-6xl'><span className='text-3xl mr-2 opacity-55'>R$</span>{ totalValue.toFixed(2) }</h1>
                <h1 className='text-xl'></h1>
            </div>
        </div>
    );
}

export default TotalMoney;


