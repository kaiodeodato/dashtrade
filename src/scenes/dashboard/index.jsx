import React from 'react';
import BarChart from '../../components/BarChart';
import PieChart from '../../components/PieChart';
import AmountDisplay from '../../components/AmountDisplay';
import TotalMoney from '../../components/TotalMoney.jsx';
import DifferentStocks from '../../components/DifferentStocks.jsx';
import BiggerStock from '../../components/BiggerStock.jsx';
import LinesChart from '../../components/LinesChart.jsx';

const Dashboard = () => {
       
    return (
        <div className='container mx-auto mt-10 gap-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
            <AmountDisplay/>
            <TotalMoney/>
            <DifferentStocks/>
            <BiggerStock/>
          </div>
         <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5'> 
          <div className='col-span-2'>
            <BarChart/>
          </div>
          <div className='col-span-1'>
            <PieChart/>
          </div>
         </div>
         <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5'> 
          <div className='col-span-3'>
            <LinesChart/>
          </div>
         </div>
    </div>  
    );
}

export default Dashboard;