import React, {useState} from 'react';
import LoadingContext from './LoadingContext';

const LoadingProvider = ({children}) => {
    const setRequestId = id => {
        setState(prev => {
            return {
                ...prev,
                requestId: [...prev.requestId, id],
            };
        });
    };

    const [state, setState] = useState({
        requestId: [],
        setRequestId,
    });

    return <LoadingContext.Provider value={state}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;
