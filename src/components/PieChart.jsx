import { ResponsivePie } from '@nivo/pie'
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from "../../UserContext.js";
import { useTheme } from "@mui/material";
import { tokens } from "../theme.js";

const PieChart = () => {
    const { trades, personalColors } = useContext(MyContext);
    const [ tradesGraph1, setTradesGraph1 ] = useState([]);
    const theme = useTheme();
    const colorsPallete = tokens(theme.palette.mode);

    const aggregatedData = trades.reduce((acc, item) => {
        if (!acc[item.title_abbr]) {
          acc[item.title_abbr] = {
            title_abbr: item.title_abbr,
            price_unit: item.price_unit,
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

        const aggregatedArray = Object.values(aggregatedData);

        const totalValue = aggregatedArray.reduce((acc, item) => {
            if (item.trade_amount > 0) {
                return acc + parseFloat(item.price_unit * item.trade_amount);
            } else {
                return acc;
            }
        }, 0);
       
    useEffect(() => {
        const filteredTrades = aggregatedArray.map((trade, index) => ({
            id: trade.title_abbr,
            label: trade.trade_amount,
            value: (trade.price_unit * trade.trade_amount).toFixed(2),
            trade_amountColor: personalColors[index]
        }));

        setTradesGraph1(filteredTrades);
        
    }, [trades]);

    return (
         <div className='rounded-lg shadow-lg w-full' style={{ height: '400px', backgroundColor: colorsPallete.primary[100] }}>
             <ResponsivePie
                data={tradesGraph1}
                colors={d => d.data.trade_amountColor}
                margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
                innerRadius={0.5}
                padAngle={0.1}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={colorsPallete.primary[800]}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={colorsPallete.primary[500]}
                tooltip={({ datum: { id, value, trade_amount } }) => (
                    <div className='rounded-lg' style={{ padding: '5px', color: '#fff', background: '#333' }}>
                        <strong>{id}</strong><br />
                        Amount: {trade_amount}<br />
                        Value: R${value}<br />
                        {((value * 100)/totalValue).toFixed(2)}%
                    </div>
                )}
            />
        </div>
    );
}

export default PieChart;
