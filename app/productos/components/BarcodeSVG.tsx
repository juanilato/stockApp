import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  value: string;
  width?: number;
  height?: number;
  format?: string;
}

export default function BarcodeSVG({ value, width = 2.5, height = 100, format = 'ean13' }: Props) {
  // HTML que genera el código de barras usando JsBarcode
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <style>
          body { 
            margin: 20px; 
            padding: 0; 
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          svg {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <svg id="barcode"></svg>
        <script>
          JsBarcode("#barcode", "${value}", {
            format: "${format}",
            width: ${width},
            height: ${height},
            displayValue: true,
            fontSize: 12,
            textMargin: 2,
            background: "#ffffff"
          });
        </script>
      </body>
    </html>
  `;

  return (
<View style={{ width: 280, height: height + 40, alignItems: 'center' }}>
  <WebView
    originWhitelist={['*']}
    source={{ html }}
    style={{ 
      backgroundColor: 'transparent',
      width: 260, 
      height: height + 20
    }}
    scrollEnabled={false}
  />
</View>
  );
} 