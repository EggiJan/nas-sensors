import * as React from 'react';
import { useState } from 'react';

interface ContextValue {
  onRangeChange: (from: number, to: number) => void;
  range: CustomDateRange | undefined;
}

export interface CustomDateRange {
  from: number;
  to: number;
}

const DateRangeContext = React.createContext<ContextValue>({
  onRangeChange: () => { },
  range: {
    from: Date.now() - 24 * 60 * 60 * 1000, // 24h in ms
    to: Date.now()
  },
})

const DateRangeContextProvider: React.FC = (props) => {
  const [range, setRange] = useState<CustomDateRange>();
  
  const onRangeChange = (from: number, to: number) => {
    console.log(`Date Range changed - from: ${from} to: ${to}`);
    setRange({ from, to });
  }

  return (
    <DateRangeContext.Provider value={{ onRangeChange, range }}>
      {props.children}
    </DateRangeContext.Provider>
  )
};

export { DateRangeContextProvider, DateRangeContext };
