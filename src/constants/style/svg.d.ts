// svg.d.ts
declare module '*.svg' {
  import {SvgProps} from 'react-native-svg';
  // React.ForwardRefExoticComponent를 사용해 ref를 허용하는 타입으로 선언
  const content: React.ForwardRefExoticComponent<
    SvgProps & React.RefAttributes<any>
  >;
  export default content;
}
