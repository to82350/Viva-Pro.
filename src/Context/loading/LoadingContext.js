import {createContext} from 'react';

const LoadingContext = createContext({
    requestId: [],
    setRequestId: () => {},
});

export default LoadingContext;
