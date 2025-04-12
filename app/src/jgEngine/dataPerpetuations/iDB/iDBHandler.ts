import { IDB_SCHEMA, StoreName } from "./iDBSchema";

export class IDBHandler{

  constructor(){

  }

  /** Memo: 実装メソッドの概要
   *    - manipulate: 共通処理（トランザクションの死活管理など）をラップするメソッド
   *    - 全件処理系 
   *      - readAllRecords   : 全件読み込み
   *      - deleteAllRecords : 全件削除
   *    - 複数処理系
   *      - createRecords             : 作成兼更新
   *      - readTargetRecordsByKey    : 複数件取得（キー指定）
   *      - deleteTargetRecordsByKey  : 複数件削除（キー指定）
   */

  /**
   * indexedDBを操作するためのラッパーメソッド
   *  イベントハンドラーを引数として受け付ける
   *  indexedDBへの正常なアクセスを保証したうえで、イベントハンドラーを実行する
   *  indexedDB利用時は必ず本メソッドを介してDBを利用すること
   *  本メソッドにDB利用前の初期化・検証チェック工程を内包する
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
   * IndexedDBのアプリ用領域自体を削除するメソッド
   * オブジェクトストアのクリーンナップではないため注意
   * @param successCallback 
   */
  static async factoryReset(successCallback?: () => void){

    const targetDBName: string = IDB_SCHEMA.DB_NAME;      // ストア定義から現行のDB名を取得

    /**
     * DBの削除が全件終了した際（transaction.oncomplete時）に、引数として入力されたコールバック関数を実行する
     */

    const DBDeleteRequest = window.indexedDB.deleteDatabase(targetDBName);

    DBDeleteRequest.onsuccess = (event) => {
      if(successCallback){ successCallback(); }
    }

    DBDeleteRequest.onerror = (event) => {
      ;
    }

  }

  /**
   * 指定したオブジェクトストアへデータを保存するメソッド
   * 既存のデータと競合した場合は、本メソッドで指定されたデータで上書きを実行する
   * @param targetStoreName データを保存するオブジェクトストアの名前
   * @param dataToSave      保存するデータ
   */
  static createRecords(targetStoreName: StoreName, dataToSave: Array<any>, 
    successCallback?: () => void){
    
    const TRANSACTION_MODE: IDBTransactionMode  = "readwrite";    // 保存操作の場合はreadwriteモードで固定

    const createCallback = (iDB: IDBDatabase) => {

      // トランザクションを開始 アクセス対象のストアを指定
      const transaction: IDBTransaction = iDB.transaction(targetStoreName, TRANSACTION_MODE);

      // アクセス対象のストアを取得
      const store: IDBObjectStore = transaction.objectStore(targetStoreName);

      // 各データごとにトランザクションを実行
      dataToSave.forEach((data) => {

        // トランザクションを実行
        /** Policy: データ重複時の対応
         *    既存のデータと競合した場合は、UIにセットされているデータを正として扱い、これで上書きをする
         */
        /** Memo: addとputの違い
         *    iDBへのデータ保存メソッドにはaddとputが存在する
         *    同一のキーのデータが既に存在する場合、addはエラーとして保存を拒否する
         *    一方でputは新規データで上書きする
         */
        const request: IDBRequest = store.put(data);

        // イベントハンドラ（add成功時）を登録
        request.onsuccess = (event) => {
          if(successCallback){ successCallback(); }
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
  
  /**
   * 指定したオブジェクトストアから、指定したキーに合致するレコードを取得するメソッド
   * 取得結果をコールバック関数へ渡したうえで実行する
   * 合致するレコードが存在しない場合は空配列をコールバック関数へ渡す
   * @param targetStoreName 
   * @param targetKeys 
   * @param successCallback 
   */
  static async readRecordsByKey(targetStoreName: StoreName, targetKeys: Array<string>, 
    successCallback: (records: Array<any>) => void){

    /**
     * レコード取得が全件終了した際（transaction.oncomplete時）に、引数として入力されたコールバック関数を実行する
     * その際、コールバック関数に対してレコードを格納した配列型オブジェクトを注入する
     */

    const TRANSACTION_MODE: IDBTransactionMode  = "readonly";    // 読み取り操作の場合はreadonlyモードで固定

    const readCallback = (iDB: IDBDatabase) => {

      // トランザクションを開始 アクセス対象のストアを指定
      const transaction: IDBTransaction = iDB.transaction(targetStoreName, TRANSACTION_MODE);

      // アクセス対象のストアを取得
      const store: IDBObjectStore = transaction.objectStore(targetStoreName);

      const records: Array<any> = [];
      targetKeys.forEach( (key: string) => {

        //  トランザクションを実行
        const request: IDBRequest = store.get(key);

        // イベントハンドラ（get成功時）を登録
        request.onsuccess = (event: Event) => {
          const iDBRequest  = event.target      as IDBRequest;
          const data        = iDBRequest.result as any;
          if(data){               // データが存在する場合のみレコードを格納
            records.push(data);   // 存在しない場合はリクエスト結果がundefinedで返り、undefinedを配列に保存してしまう
          }
        };
        
        // イベントハンドラ（get失敗時）を登録
        request.onerror = (event: Event) => {
          const error: DOMException | null = request.error;
          console.log("Error: ", error);
        };

      });

      // イベントハンドラ（トランザクションが完了時）を登録
      transaction.oncomplete = (event: Event) => {
        successCallback(records);
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

  /**
   * ToDo: 
   *  本メソッドは廃止し、カーソルによる探索的なレコード取得メソッドへ置き換える
   *  パフォーマンス上、万件単位の全件取得は避けたい
   *  しかし、ユーザーが探索的に過去データを遡るためのメソッドは提供する
   * @param targetStoreName 
   * @param successCallback レコードの取得が成功した際に実行されるコールバック関数
   */
  static async readAllRecords(targetStoreName: StoreName,
    successCallback: (records: Array<any>) => void){

    /**
     * レコード取得が全件終了した際（transaction.oncomplete時）に、引数として入力されたコールバック関数を実行する
     * その際、コールバック関数に対してレコードを格納した配列型オブジェクトを注入する
     */

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
        const data        = iDBRequest.result as Array<any>;
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
  
  static async deleteRecordsByKey(targetStoreName: StoreName, targetKeys: Array<string>, 
    successCallback?: () => void){
    
    const TRANSACTION_MODE: IDBTransactionMode  = "readwrite";    // 削除操作の場合はreadwriteモードで固定

    const deleteCallback = (iDB: IDBDatabase) => {

      // トランザクションを開始 アクセス対象のストアを指定
      const transaction: IDBTransaction = iDB.transaction(targetStoreName, TRANSACTION_MODE);

      // アクセス対象のストアを取得
      const store: IDBObjectStore = transaction.objectStore(targetStoreName);

      // 各データごとにトランザクションを実行
      targetKeys.forEach((key: string) => {

        // トランザクションを実行
        const request: IDBRequest = store.delete(key);

        // イベントハンドラ（add成功時）を登録
        request.onsuccess = (event) => {
          if(successCallback){ successCallback(); }
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

    this.manipulate(deleteCallback);  

  }


}

export default IDBHandler;