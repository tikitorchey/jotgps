import { IDB_SCHEMA, StoreName} from "./iDBSchema";

export class IDBHandler{

  constructor(){

  }

  /**
   * indexedDBを操作するためのラッパーメソッド
   *  イベントハンドラーを引数として受け付ける
   *  indexedDBへの正常なアクセスを保証したうえで、イベントハンドラーを実行する
   *  indexedDB利用時は必ず本メソッドを介してDBを利用すること
   * @param manipulateFunc indexedDBオブジェクトを引数に持つイベントハンドラー 第2引数以降は任意で使用できる残余引数をもつ
   */
  static async manipulate(manipulateFunc: (iDB: IDBDatabase, ...params: Array<any>) => void){


    // DB接続をリクエストおよび接続情報を取得
    const targetDBName    : string = IDB_SCHEMA.DB_NAME;      // ストア定義から現行のDB名を取得
    const targetBDVersion : number = IDB_SCHEMA.DB_VERSION;   // ストア定義から現行のDBバージョンを取得
    const openRequest     : IDBOpenDBRequest = window.indexedDB.open(targetDBName, targetBDVersion);    // DB接続リクエストを実行

    // イベントハンドラ（テーブル要更新時≒初期化用）を登録
    openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {

      /** 本イベントは以下のケースに合致する場合に実行される
       *    - DBが存在しない状況で、open要求された場合
       *    - DBが存在するものの、open要求時に指定バージョンが存在しない場合
       */
      /** Policy:
       *    DB操作時は都度onupgradeneededイベント実行の必要性チェックを行う処理フローとすること
       *    同一セッション内でチェックを繰り返すことになり過剰ではあるが、最新バージョンであることを保証するために容認する
       */

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
        }

      });

    };

    /** Policy: IndexedDB API関係の処理におけるエラーハンドリングはonsuccess/onerrorイベントハンドラー内で完結させる
     *    コールバックのネストが深くなってしまうため、try ~ catchは使用しない
     *    明確にtry~catchによるエラーハンドリングが必要になった場合は本方針を見直す
     */

    // イベントハンドラ（DB接続成功時・メインの処理）を登録
    openRequest.onsuccess = (event: Event) => {
      const iDBRequest  = event.target      as IDBRequest;
      const iDB         = iDBRequest.result as IDBDatabase;
      manipulateFunc(iDB);
    };

    // イベントハンドラ（DB接続失敗時）を登録
    openRequest.onerror = (event: Event) => {
      const iDBRequest  : IDBRequest          = event.target as IDBRequest;
      const error       : DOMException | null = iDBRequest.error;
      console.log("Error: ", error);
    };

  }

  /**
   * 指定したオブジェクトストアへデータを保存するメソッド
   * @param targetStoreName データを保存するオブジェクトストアの名前
   * @param dataToSave      保存するデータ
   */
  static async save(targetStoreName: StoreName, dataToSave: any){
    
    const TRANSACTION_MODE: IDBTransactionMode  = "readwrite";    // 保存操作の場合はreadwriteモードで固定

    const manipulateFunc = (iDB: IDBDatabase) => {

      // トランザクションを開始 アクセス対象のストアを指定
      const transaction: IDBTransaction = iDB.transaction(targetStoreName, TRANSACTION_MODE);

      // アクセス対象のストアを取得
      const store: IDBObjectStore = transaction.objectStore(targetStoreName);

      //  トランザクションを実行
      /** Memo: addとputの違い
       *    iDBへのデータ保存メソッドにはaddとputが存在する
       *    同一のキーのデータが既に存在する場合、addはエラーとして保存を拒否する
       *    一方でputは新規データで上書きを行う
       */
      const request: IDBRequest = store.add(dataToSave);
      
      request.onsuccess = () => {
      };
      
      request.onerror = () => {
        const error: DOMException | null = request.error;
        console.log("Error: ", error);
      };
    }

    this.manipulate(manipulateFunc);

  }
  
}

export default IDBHandler;