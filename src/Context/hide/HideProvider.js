import React, {useState} from 'react';
import HideContext from './HideContext';

const HideProvider = ({children}) => {
    const handleHide = flag => {
        setState(prev => {
            return {
                ...prev,
                isHide: flag || !prev.isHide,
            };
        });
    };

    const [state, setState] = useState({
        isHide: false,
        handleHide,
    });

    return <HideContext.Provider value={state}>{children}</HideContext.Provider>;
};

export default HideProvider;
