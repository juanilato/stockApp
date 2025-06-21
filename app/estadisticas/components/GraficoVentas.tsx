import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface GraficoVentasProps {
  data: { mes: string; total: number }[];
}

export default function GraficoVentas({ data }: GraficoVentasProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.max(screenWidth - 40, data.length * 60);

  const chartData = {
    labels: data.map((v) => v.mes.slice(5)), // "01", "02"...
    datasets: [{ data: data.map((v) => v.total) }],
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BarChart
          data={chartData}
          width={chartWidth}
          height={220}
          fromZero
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            labelColor: () => '#64748b',
            style: {
              borderRadius: 16,
            },
            propsForLabels: {
              fontSize: 12,
              fontWeight: '600',
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: '#f1f5f9',
              strokeWidth: 1,
            },
          }}
          style={styles.chart}
          showBarTops
          showValuesOnTopOfBars
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
}); 