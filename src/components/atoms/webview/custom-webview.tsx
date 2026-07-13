import {StyleSheet, SafeAreaView} from 'react-native';

import WebView, {
  WebViewMessageEvent,
  WebViewProps,
} from '@dr.pogodin/react-native-webview';
import WebViewErrorEvent from '@dr.pogodin/react-native-webview';
import {APP_CLIENT_URL} from '../../../constants/env';

export interface CustomWebviewProps<TMessage = unknown>
  extends Omit<WebViewProps, 'source' | 'onMessage'> {
  webRef: React.RefObject<WebView | null>;
  uri: string;
  onMessage?: (message: TMessage) => void;
}

const CustomWebview = <TMessage,>({
  webRef,
  uri,
  onMessage,
  ...webViewProps
}: CustomWebviewProps<TMessage>): React.JSX.Element => {
  const metaTagInjection = `
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no'
    );
    document.head.appendChild(meta);

    const style = document.createElement('style');
    style.innerHTML = \`
      input, select, textarea {
        font-size: 16px;
      }
    \`;
    document.head.appendChild(style);

    true;
  `;

  const parseMessage = (event: WebViewMessageEvent): TMessage | null => {
    try {
      return JSON.parse(event.nativeEvent.data) as TMessage;
    } catch (error) {
      console.warn('WebView message parse error:', error);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webRef}
        style={styles.webview}
        source={{uri: `${APP_CLIENT_URL}/${uri}`}}
        injectedJavaScript={metaTagInjection}
        onMessage={(event: WebViewMessageEvent) => {
          if (!onMessage) return;
          const parsed = parseMessage(event);
          if (parsed !== null) {
            onMessage(parsed);
          }
        }}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        onError={(event: WebViewErrorEvent) => {
          console.log('WebView error:', event);
        }}
        {...webViewProps}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default CustomWebview;
