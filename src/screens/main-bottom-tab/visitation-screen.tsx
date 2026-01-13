import {useRef} from 'react';

import CustomWebview from '../../components/atoms/webview/custom-webview';

const VisitationScreen = () => {
  const webRef = useRef(null);

  return (
    <>
      <CustomWebview webRef={webRef} uri={'admin/main/visitation'} />
    </>
  );
};

export default VisitationScreen;
