import SQLite from 'react-native-sqlite-storage';

export default class LocalDB {
  static async connect() {
    return SQLite.openDatabase({ name: 'inventario' });
  }

  static async init() {
    const db = await LocalDB.connect();
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS productos ( 
            id              INTEGER         PRIMARY KEY    AUTOINCREMENT, 
            nombre          VARCHAR(64)     NOT NULL,
            precio          DECIMAL(10,2)   NOT NULL    DEFAULT '0.0',
            minStock        INTEGER         NOT NULL    DEFAULT 0,
            currentStock    INTEGER         NOT NULL    DEFAULT 0,
            maxStock        INTEGER         NOT NULL    DEFAULT 0
        );`,
        [],
        () => console.log('CREATED TABLE productos'),
        error => console.error({ error }),
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS movimientos  (
          id          INTEGER   PRIMARY KEY   AUTOINCREMENT, 
          productoId  INTEGER, 
          cantidad    INTEGER, 
          fecha       TIME STAMP DEFAULT CURRENT_TIMESTAMP, 
          FOREIGN KEY (productoId) REFERENCES productos(id))`,
        [],
        () => console.log('CREATED TABLE movimientos'),
        (error) => console.error(error)
      );
    });
  }

}
