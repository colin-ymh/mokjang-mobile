import styled from 'styled-components/native';

import {GRAY} from '../../../constants/style/color';
import RequestVerify from '../../molecules/register-screen/request-verify';

const Container = styled.View`
  flex: 1;
  background-color: ${GRAY.SIDE_BAR};
  justify-content: center;
  padding: 20px;
`;

const RegisterContainer = () => {
  return (
    <Container>
      <RequestVerify />
    </Container>
  );
};

export default RegisterContainer;
