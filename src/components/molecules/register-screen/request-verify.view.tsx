import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import BorderInput from '../../atoms/common/input/border-input';
import {MainText} from '../../atoms/common/text/main-text';
import Button from '../../atoms/common/button/button';
import {getIsWellFormedMobilePhone} from '../../../utils/check';
import {getMinuteFromSecond} from '../../../utils/date';
import {BLUE} from '../../../constants/style/color';
import CheckButton from '../../atoms/common/button/check-button';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  gap: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  gap: 10px;
`;

const Title = styled.View`
  justify-content: center;
  align-items: flex-start;
  width: 60px;
`;

const InputContainer = styled.View`
  display: flex;
  flex-grow: 1;
`;

const TimeContainer = styled.View<{$isShown?: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding-left: 10px;
  opacity: ${({$isShown}) => ($isShown ? 1 : 0)};
  height: ${({$isShown}) => ($isShown ? 'auto' : '0px')};
`;

const ConsentContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

type RequestVerifyViewProps = {
  name: string;
  mobilePhone: string;
  verifyNumber: string;
  second: number;
  isRequested: boolean;
  isVerified: boolean;
  isConsent: boolean;
  onChangeName: (event: string) => void;
  onChangeMobilePhone: (event: string) => void;
  onChangeVerifyNumber: (event: string) => void;
  onPressRequest: () => void;
  onPressVerify: () => void;
  onChangeConsent: (value: boolean) => void;
  onPressDone: () => void;
};

const RequestVerifyView = ({
  name,
  mobilePhone,
  verifyNumber,
  second,
  isRequested,
  isVerified,
  isConsent,
  onChangeName,
  onChangeMobilePhone,
  onChangeVerifyNumber,
  onPressRequest,
  onPressVerify,
  onChangeConsent,
  onPressDone,
}: RequestVerifyViewProps) => {
  const {t} = useTranslation();

  return (
    <Container>
      <Row>
        <Title>
          <MainText>{t('name')}</MainText>
        </Title>
        <InputContainer>
          <BorderInput
            value={name}
            onChangeText={onChangeName}
            editable={isRequested}
            placeholder={t('placeholder.name')}
          />
        </InputContainer>
      </Row>

      <Row>
        <Title>
          <MainText>{t('mobilePhone')}</MainText>
        </Title>
        <InputContainer>
          <BorderInput
            value={mobilePhone}
            onChangeText={onChangeMobilePhone}
            editable={isRequested}
            placeholder={t('placeholder.mobilePhone')}
          />
        </InputContainer>
        <Button
          width={60}
          height={40}
          text={t('request')}
          disabled={!getIsWellFormedMobilePhone(mobilePhone) || isRequested}
          onPress={onPressRequest}
        />
      </Row>

      <Row>
        <Title>
          <MainText>{t('verifyNumber')}</MainText>
        </Title>
        <InputContainer>
          <BorderInput
            value={verifyNumber}
            onChangeText={onChangeVerifyNumber}
            editable={isVerified}
            placeholder={t('placeholder.verifyNumber')}
          />
        </InputContainer>
        <Button
          width={60}
          height={40}
          text={t('verify')}
          disabled={verifyNumber.length !== 6 || isVerified}
          onPress={onPressVerify}
        />
      </Row>
      <TimeContainer $isShown={!!second && !isVerified}>
        <MainText>{getMinuteFromSecond(second)}</MainText>
      </TimeContainer>
      <ConsentContainer>
        <MainText fontSize={14} color={BLUE.DEFAULT}>
          개인정보 수집 및 이용 동의
        </MainText>
        <CheckButton value={isConsent} onChange={onChangeConsent} />
      </ConsentContainer>
      <Button
        onPress={onPressDone}
        height={40}
        text={t('button.register')}
        disabled={!isConsent && !isRequested && !isVerified}
      />
    </Container>
  );
};

export default RequestVerifyView;
