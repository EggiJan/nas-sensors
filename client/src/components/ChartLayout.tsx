import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { DateRangeContext } from './DateRangeContext';
import { StateContext } from './StoreContext';
import Chart from './Chart';
import { NasSensorItem } from '../services/chart.service';

const ChartLayout: React.FC = () => {
  const { range } = useContext(DateRangeContext);
  const { state, fetchChartData } = useContext(StateContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!range) return;
    
    setLoading(true);
    fetchChartData(range.from, range.to).then(() => {
      setLoading(false);
    });
  }, [range])
  
  if (!state) {
    return null;
  }

  return (
    <div style={{ padding: 8 }}>
      <Chart
        chartLabel='CPU Temp'
        data={state.Items.map((item: NasSensorItem) => ({ ts: item.Timestamp, temp: item.CPUTemp }))}
        xDataKey='ts'
        xLabel='Timestamp'
        yDataKey='temp'
        yLabel='Temp [°C]'
        loading={loading}
      />
      <Chart
        chartLabel='Mainboard Temp'
        data={state.Items.map((item: NasSensorItem) => ({ ts: item.Timestamp, temp: item.SYSTemp }))}
        xDataKey='ts'
        xLabel='Timestamp'
        yDataKey='temp'
        yLabel='Temp [°C]'
        loading={loading}
      />
      <Chart
        chartLabel='Temp1 Temp'
        data={state.Items.map((item: NasSensorItem) => ({ ts: item.Timestamp, temp: item.Temp1Temp }))}
        xDataKey='ts'
        xLabel='Timestamp'
        yDataKey='temp'
        yLabel='Temp [°C]'
        loading={loading}
      />
      <Chart
        chartLabel='Front Fan Speed'
        data={state.Items.map((item: NasSensorItem) => ({ ts: item.Timestamp, rpm: item.Fan1Speed }))}
        xDataKey='ts'
        xLabel='Timestamp'
        yDataKey='rpm'
        yLabel='RPM'
        loading={loading}
      />
      <Chart
        chartLabel='CPU Fan Speed'
        data={state.Items.map((item: NasSensorItem) => ({ ts: item.Timestamp, rpm: item.Fan2Speed }))}
        xDataKey='ts'
        xLabel='Timestamp'
        yDataKey='rpm'
        yLabel='RPM'
        loading={loading}
      />
    </div>
  );
};


export default ChartLayout;