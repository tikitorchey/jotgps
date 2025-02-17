import { IDB_SCHEMA, StoreName} from "./iDBSchema";

export class IDBHandler{

  constructor(){

  }

  /**
   * indexedDBを操作するためのラッパーメソッド
   *  イベントハンドラーを引数として受け付ける
   *  indexedDBへの正常なアクセスを保証したうえで、イベントハンドラーを実行する
   *  indexedDB利用時は必ず本メソッドを介してDBを利用すること
   *  本メソッドにDB利用前の検証チェック工程を内包する
   * @param successCallback DBアクセス成功時に実行されるコールバック関数
   *    第1引数にindexedDBオブジェクトを受け付ける（コールバック実行時に自動的に注入される）
   *    第2引数以降に任意で使用できる残余引数を受け付ける
   */
  private static async manipulate(successCallback: (iDB: IDBDatabase, ...params: Array<any>) => void){

    // DB接続をリクエストおよび接続情報を取得
    const targetDBName    : string = IDB_SCHEMA.DB_NAME;      // ストア定義から現行のDB名を取得
    const targetBDVersion : number = IDB_SCHEMA.DB_VERSION;   // ストア定義から現行のDBバージョンを取得
    const openRequest     : IDBOpenDBRequest = window.indexedDB.open(targetDBName, targetBDVersion);    // DB接続リクエストを実行

    // イベントハンドラ（テーブル要更新時≒初期化用）を登録
    /** 本イベントは以下のケースに合致する場合に実行される
     *    - DBが存在しない状況で、open要求された場合
     *    - DBが存在するものの、open要求時に指定バージョンが存在しない場合
     */
    openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {

      const iDBRequest  : IDBRequest  = event.target      as IDBRequest;
      const iDB         : IDBDatabase = iDBRequest.result as IDBDatabase;

      // DBのストア定義情報をもとに各ストアをセットアップ
      IDB_SCHEMA.STORE.map( (objectStoreInfo) => {

        const name    :string = objectStoreInfo.NAME;
        const keyPath :string = objectStoreInfo.KEY_PATH;

        // 指定されたオブジェクトストアの存在をチェック
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
      successCallback(iDB);
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
  static createRecords(targetStoreName: StoreName, dataToSave: Array<any>){
    
    const TRANSACTION_MODE: IDBTransactionMode  = "readwrite";    // 保存操作の場合はreadwriteモードで固定

    const createCallback = (iDB: IDBDatabase) => {

      // トランザクションを開始 アクセス対象のストアを指定
      const transaction: IDBTransaction = iDB.transaction(targetStoreName, TRANSACTION_MODE);

      // アクセス対象のストアを取得
      const store: IDBObjectStore = transaction.objectStore(targetStoreName);

      // 各データごとにトランザクションを実行
      dataToSave.forEach((data) => {

        // トランザクションを実行
        const request: IDBRequest = store.add(data);

        // イベントハンドラ（add成功時）を登録
        request.onsuccess = (event) => {
        };

        // イベントハンドラ（add失敗時）を登録
        request.onerror = (event: Event) => {
          const error: DOMException | null = request.error;
          console.log("Error: ", error);
        };

      });

      // イベントハンドラ（トランザクションが完了時）を登録
      transaction.oncomplete = (event: Event) => {
      };

      // イベントハンドラ（トランザクション中のエラー発生時）を登録
      transaction.onerror = (event: Event) => {
        const iDBRequest  : IDBRequest          = event.target as IDBRequest;
        const error       : DOMException | null = iDBRequest.error;
        console.log("Error: ", error);
      };

    }

    this.manipulate(createCallback);

  }

  static async readAllRecords(targetStoreName: StoreName,
    successCallback: (iDB: IDBDatabase, ...params: Array<any>) => void){

    const TRANSACTION_MODE: IDBTransactionMode  = "readonly";    // 読み取り操作の場合はreadonlyモードで固定

    const readCallback = (iDB: IDBDatabase) => {

      // トランザクションを開始 アクセス対象のストアを指定
      const transaction: IDBTransaction = iDB.transaction(targetStoreName, TRANSACTION_MODE);

      // アクセス対象のストアを取得
      const store: IDBObjectStore = transaction.objectStore(targetStoreName);

      //  トランザクションを実行
      const request: IDBRequest = store.getAll();
      
      // イベントハンドラ（get成功時）を登録
      request.onsuccess = (event: Event) => {
        const iDBRequest  = event.target      as IDBRequest;
        const data        = iDBRequest.result as IDBDatabase;
        successCallback(data);
      };
      
      // イベントハンドラ（get失敗時）を登録
      request.onerror = (event: Event) => {
        const error: DOMException | null = request.error;
        console.log("Error: ", error);
      };

      // イベントハンドラ（トランザクションが完了時）を登録
      transaction.oncomplete = (event: Event) => {
      };

      // イベントハンドラ（トランザクション中のエラー発生時）を登録
      transaction.onerror = (event: Event) => {
        const iDBRequest  : IDBRequest          = event.target as IDBRequest;
        const error       : DOMException | null = iDBRequest.error;
        console.log("Error: ", error);
      };
    }

    this.manipulate(readCallback);

  }
  
}

export default IDBHandler;