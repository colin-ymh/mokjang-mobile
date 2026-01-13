import {useRef} from 'react';

import CustomWebview from '../../components/atoms/webview/custom-webview';

const EducationScreen = () => {
  console.log('education screen');
  const webRef = useRef(null);

  return (
    <>
      <CustomWebview webRef={webRef} uri={'ko/admin/main/education/all'} />
    </>
  );
};

export default EducationScreen;
