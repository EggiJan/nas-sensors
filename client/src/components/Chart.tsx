import * as React from 'react';
import { Typography } from 'antd';
const { Title } = Typography;
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Label } from 'recharts';

interface ChartProps {
  chartLabel: string;
  xDataKey: string;
  xLabel: string;
  yDataKey: string;
  yLabel: string;
  data: {
    [key: string]: number | string
  }[];
  loading: boolean;
}

const ChartSkeleton = () => {
  return (
    <div
      style={{
        height: 400,
        width: '100%',
        margin: 16,
      }}
      className='placeholder-item'></div>
  )
};

const Chart: React.FC<ChartProps> = (props) => {
  if (props.loading) {
    <>
      <Title level={3}>{props.chartLabel}</Title>
      <ChartSkeleton />
    </>
  }
  
  return (
    <>
      <h2>{props.chartLabel}</h2>
      <ResponsiveContainer height={400} width='100%'>
        <LineChart
          data={props.data}
          margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
        >
          <XAxis dataKey={props.xDataKey}>
            <Label value={props.xLabel} offset={0} position="bottom" />
          </XAxis>
          <YAxis>
            <Label value={props.yLabel} offset={0} position="center" angle={-90} />
          </YAxis>
          <Tooltip />
          <CartesianGrid stroke="#000" strokeDasharray="5 5" />
          <Line type="monotone" dataKey={props.yDataKey} stroke="#387908" yAxisId={0} />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

export default Chart;