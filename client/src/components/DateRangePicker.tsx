import * as React from "react";
import { useContext, useState, useEffect } from 'react';
import { DateRangeContext } from "./DateRangeContext";

type DateRange = '1h' | '3h' | '1d' | '1w' | '2w';

interface DateRangeOptionProps {
  value: DateRange;
  label: string;
  active: boolean;
  onClick: (value: DateRange) => void;
}

type ConvertUnit = 'h' | 'd' | 'w';
const convertToMs = (amount: number, unit: ConvertUnit) => {
  console.log('Convert to MS', amount, unit);
  switch (unit) {
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    case 'w':
      return amount * 7 * 24 * 60 * 60 * 1000;
    default:
      return amount * 1000;
  }
}

const DateRangeOption: React.FC<DateRangeOptionProps> = (props) => {
  return <a
    onClick={() => props.onClick(props.value)}
    style={{ textDecoration: props.active ? 'underline' : 'none', marginRight: 8}}
    >{props.label}
    </a>
}

const DateRangePicker: React.FC = () => {
  const [range, setRange] = useState<DateRange>('1d');
  const { onRangeChange } = useContext(DateRangeContext);

  useEffect(() => {
    handleChange(range);
  }, []);

  const handleChange = (range: DateRange) => {
    setRange(range);
    const [amount, unit] = range;
    const to = Date.now();
    let from = to - convertToMs(parseInt(amount), unit as ConvertUnit);

    onRangeChange(from, to);
  }

  const options: DateRange[] = ['1h','3h','1d','1w'];

  return (
    <div>
      {options.map(v => <DateRangeOption value={v} label={v} active={v === range} onClick={handleChange} key={v} />)}
    </div>
  )
};


export default DateRangePicker;