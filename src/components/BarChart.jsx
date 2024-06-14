import { ResponsiveBar } from '@nivo/bar';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from "../../UserContext.js";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const BarChart = () => {
    const { trades, personalColors } = useContext(MyContext);
    const [ tradesGraph1, setTradesGraph1 ] = useState([]);
    const theme = useTheme();
    const colorsPallete = tokens(theme.palette.mode);

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

        const aggregatedArray = Object.values(aggregatedData);

        useEffect(() => {
            const filteredTrades = aggregatedArray.map((trade, index) => {
                // if (trade.trade_amount > 0) {
                if (trade.trade_amount !== null) {
                    return {
                        title_abbr: trade.title_abbr,
                        trade_amount: trade.trade_amount,
                        trade_amountColor: personalColors[index]
                    };
                } else {
                    return null;
                }
            }).filter(trade => trade !== null);
            setTradesGraph1(filteredTrades);
        }, [trades]);

    return (
         <div className='rounded-lg shadow-lg w-full' style={{ height: '400px', backgroundColor: colorsPallete.primary[100] }}>
            <ResponsiveBar
                data={tradesGraph1}
                keys={['trade_amount']}
                indexBy="title_abbr"
                margin={{ top: 50, right: 40, bottom: 50, left: 70 }}
                padding={0.1}
                valueScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                indexScale={{ type: 'band', round: true }}
                colors={d => d.data.trade_amountColor}
                borderRadius={5}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.6]]
                }}
                axisTop={null}
                axisRight={null}
                
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'title_abbr',
                    legendPosition: 'middle',
                    legendOffset: 32,
                    truncateTickAt: 0,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'trade_amount',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    truncateTickAt: 0,
                }}
                labelSkipWidth={16}
                labelSkipHeight={16}
                labelTextColor={colorsPallete.primary[500]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={e => `${e.id}: ${e.formattedValue} in country: ${e.indexValue}`}
                tooltip={({ value, indexValue }) => (
                    <div className='rounded-lg' style={{ padding: '5px', color: '#fff', background: '#333' }}>
                        <strong>{indexValue}</strong><br />
                        Amount: {value}
                    </div>
                )}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: `${colorsPallete.primary[800]}`,
                                opacity: 1,
                            },
                        },
                        legend: {
                            text: {
                                fill: `${colorsPallete.primary[800]}`,
                            },
                        },
                    },
                    legends: {
                        text: {
                            fill: `${colorsPallete.primary[800]}`,
                        },
                    },
                    grid: {
                        line: {
                            stroke: `${colorsPallete.primary[800]}`,
                            strokeWidth: 0.3,
                        },
                    },
                }}
            />
        </div>
    );
}

export default BarChart;
