import {createContext} from 'react';

// null로 설정해도 되지만, 어떤 값을 관리할지 작성하는게 좋음.
const HideContext = createContext({
    isHide: false,
    handleHide: () => {},
});

export default HideContext;
