import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';

import BorderInput from '../../atoms/common/input/border-input';
import {MainText} from '../../atoms/common/text/main-text';
import Button from '../../atoms/common/button/button';
import {getIsWellFormedMobilePhone} from '../../../utils/check';
import {getMinuteFromSecond} from '../../../utils/date';
import {BLUE} from '../../../constants/style/color';
import CheckButton from '../../atoms/common/button/check-button';

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

  const isTimeShown = !!second && !isVerified;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.title}>
          <MainText>{t('name')}</MainText>
        </View>
        <View style={styles.inputContainer}>
          <BorderInput
            value={name}
            onChangeText={onChangeName}
            editable={isRequested}
            placeholder={t('placeholder.name')}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.title}>
          <MainText>{t('mobilePhone')}</MainText>
        </View>
        <View style={styles.inputContainer}>
          <BorderInput
            value={mobilePhone}
            onChangeText={onChangeMobilePhone}
            editable={isRequested}
            placeholder={t('placeholder.mobilePhone')}
          />
        </View>
        <Button
          width={60}
          height={40}
          text={t('request')}
          disabled={!getIsWellFormedMobilePhone(mobilePhone) || isRequested}
          onPress={onPressRequest}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.title}>
          <MainText>{t('verifyNumber')}</MainText>
        </View>
        <View style={styles.inputContainer}>
          <BorderInput
            value={verifyNumber}
            onChangeText={onChangeVerifyNumber}
            editable={isVerified}
            placeholder={t('placeholder.verifyNumber')}
          />
        </View>
        <Button
          width={60}
          height={40}
          text={t('verify')}
          disabled={verifyNumber.length !== 6 || isVerified}
          onPress={onPressVerify}
        />
      </View>

      <View
        style={[
          styles.timeContainer,
          isTimeShown ? styles.timeShown : styles.timeHidden,
        ]}>
        <MainText>{getMinuteFromSecond(second)}</MainText>
      </View>

      <View style={styles.consentContainer}>
        <MainText fontSize={14} color={BLUE.DEFAULT}>
          개인정보 수집 및 이용 동의
        </MainText>
        <CheckButton value={isConsent} onChange={onChangeConsent} />
      </View>

      <Button
        onPress={onPressDone}
        height={40}
        text={t('button.register')}
        disabled={!isConsent && !isRequested && !isVerified}
      />
    </View>
  );
};

export default RequestVerifyView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    gap: 10,
  },

  title: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 60,
  },

  inputContainer: {
    flexGrow: 1,
  },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  timeShown: {
    opacity: 1,
  },
  timeHidden: {
    opacity: 0,
    height: 0,
  },

  consentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
