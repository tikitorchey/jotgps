import IDB_SCHEMA from "./iDBSchema";

export class IDBHandler{

  constructor(){

  }

  static async manipulate(manipulateFunc: (iDB: IDBDatabase) => void){

    try {

      // DB接続リクエストを実行および接続情報を取得
      const request: IDBOpenDBRequest = window.indexedDB.open(IDB_SCHEMA.DB_NAME, IDB_SCHEMA.DB_VERSION);

      // イベントハンドラ（テーブル要更新時≒初期化用）を登録
      /** 本イベントは以下のケースに合致する場合に実行される
       *    - DBが存在しない状況で、open要求された場合
       *    - DBが存在するものの、open要求時に指定バージョンが存在しない場合
       */
      /** Policy:
       *    DB操作時は都度onupgradeneededイベント実行の必要性チェックを行う処理フローとすること
       *    同一セッション内でチェックを繰り返すことになり過剰ではあるが、最新バージョンであることを保証するために容認する
       */
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {

        const iDBRequest  : IDBRequest  = event.target      as IDBRequest;
        const iDB         : IDBDatabase = iDBRequest.result as IDBDatabase;

        // DBのストア定義情報をもとに各ストアをセットアップ
        IDB_SCHEMA.STORE.map( (objectStoreInfo) => {

          const name    :string = objectStoreInfo.NAME;
          const keyPath :string = objectStoreInfo.KEY_PATH;

          // 指定バージョンのDBに、指定された名前のオブジェクトストアが存在するかチェック
          const isExists: boolean = iDB.objectStoreNames.contains(name);
          // 存在しない場合は、オブジェクトストアを新規作成
          if(!isExists){
            iDB.createObjectStore(name, { keyPath: keyPath });
            console.log(`Object Store "${ name }" is created.`);
          }

        });

      };

      // イベントハンドラ（DB接続成功時・メインの処理）を登録
      request.onsuccess = (event: Event) => {

        const iDBRequest  = event.target      as IDBRequest;
        const iDB         = iDBRequest.result as IDBDatabase;
        manipulateFunc(iDB);
        
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

export default IDBHandler;