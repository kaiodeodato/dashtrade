import { ResponsiveLine } from '@nivo/line';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from "../../UserContext.js";
import { useTheme } from "@mui/material";
import { tokens } from "../theme.js";

const LinesChart = () => {
    const { trades, personalColors } = useContext(MyContext);
    const [tradesGraph1, setTradesGraph1] = useState([]);
    const theme = useTheme();
    const colorsPallete = tokens(theme.palette.mode);

    useEffect(() => {
        const aggregatedData = trades.reduce((acc, item) => {
            if (!acc[item.title_abbr]) {
                acc[item.title_abbr] = {
                    title_abbr: item.title_abbr,
                    trade_status: item.trade_status,
                    data: [],
                    accumulatedAmount: 0 
                };
            }
    
            acc[item.title_abbr].data.push({
                x: item.trade_date,
                y: parseFloat(item.trade_amount),
                trade_status: item.trade_status
            });
    
            return acc;
        }, {});
    
        Object.values(aggregatedData).forEach(trade => {
            trade.data.sort((a, b) => new Date(a.x) - new Date(b.x));
    
            trade.data.forEach(dataPoint => {
                if (dataPoint.y) {

                    if (dataPoint.trade_status === "v") {
                        trade.accumulatedAmount -= dataPoint.y;
                    } else {
                        trade.accumulatedAmount += dataPoint.y;
                    }
                }
                dataPoint.y = trade.accumulatedAmount;
            });
        });
    
        const filteredTrades = Object.values(aggregatedData).map((trade, index) => ({
            id: trade.title_abbr,
            color: personalColors[index],
            data: [...trade.data]
        }));
    
        setTradesGraph1(filteredTrades);
    }, [trades, personalColors]);

    return (
        <div className='rounded-lg shadow-lg w-full' style={{ height: '400px', backgroundColor: colorsPallete.primary[100] }}>
            <ResponsiveLine
                data={tradesGraph1}
                colors={{ datum: 'color' }}
                margin={{ top: 50, right: 110, bottom: 70, left: 60 }}
                xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false, precision: 'day' }}
                xFormat="time:%Y-%m-%d"
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                    reverse: false
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    format: '%b %d %y',
                    tickValues: 'every 1 month',
                    tickSize: 5,
                    tickPadding: 0,
                    tickRotation: -45,
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Trade Amount',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}

                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                pointSize={5}
                pointLabel={null}
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',

                    }
                ]}
                tooltip={({ point }) => (
                    <div className='rounded-lg' style={{ padding: '5px', color: '#fff', background: '#333' }}>
                        <strong>Stock: {point.id.replace(/\.\d+$/, '')}</strong><br />
                        <strong>Date: {point.data["xFormatted"]}</strong><br />
                        <strong>Current Amount {point.data["yFormatted"]}</strong><br />
                        {/* {JSON.stringify(point)} */}
                    </div>
                )}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: `${colorsPallete.primary[800]}`,
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

export default LinesChart;
