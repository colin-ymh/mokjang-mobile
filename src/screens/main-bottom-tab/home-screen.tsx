import {useRef} from 'react';

import CustomWebview from '../../components/atoms/webview/custom-webview';

const HomeScreen = () => {
  const webRef = useRef(null);

  return (
    <>
      <CustomWebview webRef={webRef} uri={'main/home'} />
    </>
  );
};

export default HomeScreen;
