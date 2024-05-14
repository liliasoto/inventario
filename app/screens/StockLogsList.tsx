// En StockLogsList.tsx
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import LocalDB from '../persistance/localdb.ts';

interface StockLog {
  id: number;
  productId: number;
  timestamp: string;
  quantity: number;
  action: string;
}

function StockLogsList({ productId }: { productId: number }): React.JSX.Element {
  const [logs, setLogs] = useState<StockLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const db = await LocalDB.connect();
        const [results] = await db.executeSql(
          `SELECT * FROM stockLogs WHERE productId = ? ORDER BY timestamp DESC;`,
          [productId]
        );
        if (results && results.rows && results.rows.raw) {
          const fetchedLogs: StockLog[] = results.rows.raw();
          setLogs(fetchedLogs);
        } else {
          console.error('No se recibieron resultados válidos de la consulta SQL:', results);
        }
      } catch (error) {
        console.error('Error al ejecutar la consulta SQL:', error);
      }
    };
  
    fetchLogs();
  }, [productId]);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Logs</Text>
      <ScrollView style={styles.scrollView}>
        {logs.map((log: StockLog, index: number) => (
          <View key={index} style={styles.logItem}>
            <Text>{log.timestamp}</Text>
            <Text>{log.quantity > 0 ? `+${log.quantity}` : log.quantity}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: 200,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default StockLogsList;
