// services/mercadoPago.ts
import axios from 'axios';

const MERCADO_PAGO_API = 'https://api.mercadopago.com';

export interface PaymentItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

export interface PaymentData {
  external_reference: string;
  items: PaymentItem[];
  total_amount: number;
}

export interface TransferData {
  amount: number;
  description?: string;
  recipient_id?: string;
  alias?: string;
}

export const generatePaymentQR = async (paymentData: PaymentData, accessToken: string): Promise<string> => {
  try {
    const preferenceData = {
      items: paymentData.items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "ARS"
      })),
      external_reference: paymentData.external_reference,
      back_urls: {
        success: "https://tuapp.com/success",
        failure: "https://tuapp.com/failure",
        pending: "https://tuapp.com/pending"
      },
      auto_return: "approved",
      notification_url: "https://tuapp.com/webhook",
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" },
          { id: "atm" }
        ],
        installments: 1
      }
    };

    const response = await axios.post(
      `${MERCADO_PAGO_API}/checkout/preferences`,
      preferenceData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.init_point;
  } catch (error) {
    console.error('Error al generar QR de pago:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (paymentId: string, accessToken: string) => {
  try {
    const response = await axios.get(
      `${MERCADO_PAGO_API}/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    return response.data.status;
  } catch (error) {
    console.error('Error al verificar estado del pago:', error);
    throw error;
  }
};

function calculateCRC16XModem(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
    crc &= 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export const generateTransferQR = (transfer: TransferData) => {
  if (!transfer.alias) {
    throw new Error('Se requiere un alias para generar el QR');
  }

  const { alias, amount } = transfer;
  
  // Formato EMV QR para Mercado Pago
  // 00 - Payload Format Indicator
  // 01 - Point of Initiation Method
  // 26 - Merchant Account Information
  // 52 - Merchant Category Code
  // 53 - Transaction Currency
  // 54 - Transaction Amount
  // 58 - Country Code
  // 59 - Merchant Name
  // 60 - Merchant City
  // 63 - CRC

  const montoStr = amount.toFixed(2).replace('.', '');
  const aliasLength = alias.length.toString().padStart(2, '0');
  
  const baseQR = [
    '000201', // Payload Format Indicator
    '010212', // Point of Initiation Method
    `26${aliasLength}${alias.toLowerCase()}`, // Merchant Account Information
    '52045999', // Merchant Category Code
    '5303986', // Transaction Currency (ARS)
    `54${montoStr.length}${montoStr}`, // Transaction Amount
    '5802AR', // Country Code
    '5906MERCADO', // Merchant Name
    '6004CABA', // Merchant City
    '6304' // CRC placeholder
  ].join('');

  const crc = calculateCRC16XModem(baseQR);
  const qrFinal = baseQR + crc;

  return {
    qr_code: qrFinal,
    amount,
    alias
  };
};

export const generateDynamicQR = async ({
  userId,
  posId,
  accessToken,
  total,
  items,
  externalReference,
  description,
}: {
  userId: string;
  posId: string;
  accessToken: string;
  total: number;
  items: any[];
  externalReference: string;
  description: string;
}) => {
  const url = `https://api.mercadopago.com/instore/orders/qr/seller/collectors/${userId}/pos/${posId}/qrs`;
  const body = {
    title: 'Venta en tienda',
    description,
    external_reference: externalReference,
    items,
    total_amount: total,
  };
  const response = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data.qr_data;
};