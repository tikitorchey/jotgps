export class UtilsForDB{

  /** ToDo:
   * Utilsというクラスおよびフォルダは利用目的が判然としないため、
   * 避けることが望ましい。要改修。
   */

  constructor(){

  }

  static async dbTest(dbManipulateFunc: (iDB: IDBDatabase) => void){

    // 参考： https://qiita.com/tanimoto-hikari/items/5fd81962153531e8275e
    const DB_NAME           : string = 'test';
    const DB_VERSION        : number = 1;
    const DB_STORE_JOTTING  : string = "jotting";

    try {

      // DB接続リクエストを実行および接続情報を取得
      const request: IDBOpenDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

      // イベントハンドラ（テーブル要更新時≒初期化用）を登録
      /** 本イベントが実行される場合は以下
       *    - データベースが作成されていない場合
       *    - テーブルのバージョンが指定よりも古い場合
       */
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {

        const iDBRequest  = event.target      as IDBRequest;
        const iDB         = iDBRequest.result as IDBDatabase;

        // オブジェクトストア（≒テーブル）が存在しない場合は新規作成
        if (!iDB.objectStoreNames.contains(DB_STORE_JOTTING)) {
          iDB.createObjectStore(DB_STORE_JOTTING, { keyPath: 'id' });
        }

      };

      // イベントハンドラ（DB接続成功時・メインの処理）を登録
      request.onsuccess = (event: Event) => {

        const iDBRequest  = event.target      as IDBRequest;
        const iDB         = iDBRequest.result as IDBDatabase;
        dbManipulateFunc(iDB);
        
      };

      // イベントハンドラ（DB接続失敗時）を登録
      request.onerror = (event: Event) => {
        const iDBRequest  : IDBRequest          = event.target as IDBRequest;
        const error       : DOMException | null = iDBRequest.error;
        throw(error);
      };

    } catch(error) {
      console.error(error);
    }

  }
}

export default UtilsForDB;