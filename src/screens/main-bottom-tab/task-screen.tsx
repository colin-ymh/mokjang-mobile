import {useRef} from 'react';

import CustomWebview from '../../components/atoms/webview/custom-webview';

const TaskScreen = () => {
  const webRef = useRef(null);

  return (
    <>
      <CustomWebview webRef={webRef} uri={'admin/main/task'} />
    </>
  );
};

export default TaskScreen;
