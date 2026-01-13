import {useRef} from 'react';

import CustomWebview from '../../components/atoms/webview/custom-webview';

const CalendarScreen = () => {
  const webRef = useRef(null);

  return (
    <>
      <CustomWebview webRef={webRef} uri={'admin/main/calendar'} />
    </>
  );
};

export default CalendarScreen;
