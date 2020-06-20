import * as React from 'react';
import { useState } from 'react';
import { NasSensorItem, fetchData } from '../services/chart.service';
import { useAuth0 } from './AuthenticationContext';

interface State {
  Items: Array<NasSensorItem>;
}

interface ContextValue {
  fetchChartData: (from: number, to: number) => Promise<void>;
  state: State;
}

const StateContext = React.createContext<ContextValue>({
  fetchChartData: () => Promise.resolve(),
  state: {
    Items: [],
  }
})

const StateContextProvider: React.FC = (props) => {
  const { getIdTokenClaims } = useAuth0();
  const [state, setState] = useState<State>({ Items: []});

  const fetchChartData = async (from: number, to: number) => {
    console.log('StateContext - fetchChartData');
    const token = await getIdTokenClaims();

    const data = await fetchData(from, to, { auth: { token }});
    setState(data);
  }

  return (
    <StateContext.Provider value={{ fetchChartData, state }}>
      {props.children}
    </StateContext.Provider>
  )
};

export { StateContextProvider, StateContext };
