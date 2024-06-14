import React from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useTheme } from "@mui/material";
import { tokens } from "../theme.js";

const TotalMoneySelection = ({ value, title, textColor }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div className='grid grid-cols-1 justify-between items-center rounded-lg h-36 px-4 shadow-lg' style={{ backgroundColor: colors.primary[100] }}   >
            <div className='flex justify-between items-center w-full text-lg'>
                <h1>{ title }</h1>
                <div className='p-1 rounded-full' style={{ backgroundColor: colors.primary[700],color: colors.primary[100]  }}>
                    <AttachMoneyIcon fontSize="large"/>
                </div>
            </div>
            <div className='flex justify-center items-center gap-6'>
                <h1 className={`text-5xl ${textColor}`}><span className='text-3xl mr-2 opacity-55'>R$</span>{ value }</h1>
                <h1 className='text-xl'></h1>
            </div>
        </div>
    );
}

export default TotalMoneySelection;


