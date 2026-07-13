import MemberList from '../../components/organisms/member-screen/member-list';

const MemberScreen = () => {
  return (
    <MemberList
      onPressMember={memberId => {
        // TODO: 교인 상세 화면 이동 (다음 증분)
        console.log('member pressed:', memberId);
      }}
      onPressAdd={() => {
        // TODO: 교인 추가 모달 (다음 증분)
        console.log('add member');
      }}
    />
  );
};

export default MemberScreen;
