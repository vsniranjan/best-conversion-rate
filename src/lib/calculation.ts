type CalculationResult = {
  receivingAmtINR: number;
  totalFee: number;
  effectiveRate: number;
  breakdown: {
    conversion?: {
      description: string;
      amount: number;
    };
    platformFee?: {
      description: string;
      amount: number;
    };
    additionalFees?: Array<{
      description: string;
      amount: number;
    }>;
  };
};

export const calcBankCharges = (amtINRUsingTTRate: number): number => {
  const taxableValue = (() => {
    if (amtINRUsingTTRate < 100000) {
      return 0.01 * amtINRUsingTTRate > 250 ? 0.01 * amtINRUsingTTRate : 250;
    } else if (amtINRUsingTTRate < 1000000) {
      return 1000 + 0.005 * (amtINRUsingTTRate - 100000);
    } else {
      return 5500 + 0.001 * (amtINRUsingTTRate - 1000000);
    }
  })();

  const gstOnTaxableValue = 0.18 * taxableValue;
  return gstOnTaxableValue;
};

export const calcMulya = (amtUSD: number, rate: number): CalculationResult => {
  const amtINR = amtUSD * rate;
  const totalFee = Number((amtINR * 0.01).toFixed(2));
  const receivingAmtINR = Number((amtINR - totalFee).toFixed(2));
  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    conversion: {
      description: "Mid-market conversion",
      amount: amtINR,
    },
    platformFee: {
      description: "1% of gross amount",
      amount: totalFee,
    },
    additionalFees: [],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    breakdown,
  };
};

export const calcInfinityApp = (
  amtUSD: number,
  rate: number,
): CalculationResult => {
  const amtINR = amtUSD * rate;

  const totalFee = Number((amtINR * 0.005).toFixed(2));
  const receivingAmtINR = Number((amtINR - totalFee).toFixed(2));

  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    conversion: {
      description: "Mid-market conversion",
      amount: amtINR,
    },
    platformFee: {
      description: "0.5% fee",
      amount: totalFee,
    },
    additionalFees: [],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    breakdown,
  };
};

export const calcSkydo = (amtUSD: number, rate: number): CalculationResult => {
  const amtINR = amtUSD * rate;
  const transactionFee = (() => {
    if (amtUSD < 2000) return 19 * rate;
    if (amtUSD < 10000) return 29 * rate;
    return 0.003 * amtINR;
  })();

  const gstOnTransactionFee = transactionFee * 0.18;

  const totalFee = Number((transactionFee + gstOnTransactionFee).toFixed(2));
  const receivingAmtINR = Number((amtINR - totalFee).toFixed(2));

  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    conversion: {
      description: "Mid-market conversion",
      amount: amtINR,
    },
    platformFee: {
      description: "Transaction fee",
      amount: transactionFee,
    },
    additionalFees: [
      {
        description: "GST on transaction fee",
        amount: gstOnTransactionFee,
      },
    ],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    breakdown,
  };
};

export const calcIDFC = (
  amtUSD: number,
  rate: number,
  ttBuyRate: number,
): CalculationResult => {
  const amtINR = amtUSD * rate;
  const amtINRUsingTTRate = amtUSD * ttBuyRate;
  const effectiveForexFee = amtINR - amtINRUsingTTRate;
  const gstOnTaxableValue = calcBankCharges(amtINRUsingTTRate);
  const totalFee = Number((effectiveForexFee + gstOnTaxableValue).toFixed(2));
  const receivingAmtINR = Number((amtINR - totalFee).toFixed(2));
  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    conversion: {
      description: "Mid-market conversion",
      amount: amtINR,
    },
    platformFee: {
      description: "Forex fees",
      amount: effectiveForexFee,
    },
    additionalFees: [
      {
        description: "Bank charges",
        amount: gstOnTaxableValue,
      },
    ],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    breakdown,
  };
};

export const calcIOB = (
  amtUSD: number,
  rate: number,
  ttBuyRate: number,
): CalculationResult => {
  const amtINR = amtUSD * rate;
  const amtINRUsingTTRate = amtUSD * ttBuyRate;
  const effectiveForexFee = amtINR - amtINRUsingTTRate;
  const gstOnTaxableValue = calcBankCharges(amtINRUsingTTRate);
  const IRCFee = 250;
  const gstOnIRC = IRCFee * 0.18;
  const IRCTotalFee = IRCFee + gstOnIRC;
  const totalFee = Number(
    (effectiveForexFee + gstOnTaxableValue + IRCTotalFee).toFixed(2),
  );
  const receivingAmtINR = Number((amtINR - totalFee).toFixed(2));
  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    conversion: {
      description: "Mid-market conversion",
      amount: amtINR,
    },
    platformFee: {
      description: "Forex fees",
      amount: effectiveForexFee,
    },
    additionalFees: [
      {
        description: "Bank charges",
        amount: gstOnTaxableValue,
      },
      {
        description: "IRC fee",
        amount: IRCTotalFee,
      },
    ],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    breakdown,
  };
};
