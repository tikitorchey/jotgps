import Utils from "./utils";
import IDBHandler from "./dataPerpetuations/iDBHandler";
import Jotting from "./models/jotting";

export class JGEngine{

  /**
   * 端末が位置するGPS座標（緯度経度系）を端末から取得する関数
   * 
   * @remarks
   *  GPS座標の取得にはGeolocationAPIを利用
   * 
   * @returns
   *  [ToDo: 追記]
   */
  static getGPSCoords(): Promise<GeolocationPosition>{

    // GeolocationAPIより現在地の座標を取得
    return new Promise( (successCallback, errorCallback) => {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } );
    
  }

  /**
   * JavaScriptオブジェクトをJSONファイルへ変換し、指定された名前のファイルを端末へダウンロードするメソッド
   * @param targetData JSONファイルへ変換するJavaScriptオブジェクト
   * @param fileName 出力するJSONファイルの名前 拡張子を除いた部分とすること
   */
  static async exportJSON(targetData: Object, fileName: string){

    /** ToDo: ブラウザがFile System APIに対応しているかを確認する処理を追加し整理（ exportJSON_OLDに非対応時の処理を一時定義している）
     * 例として追加が必要な処理の例を以下に記載
     *   const supportsFileSystemAccess =
          "showSaveFilePicker" in window &&
     */

    // JacaScriptオブジェクトをBLOB（JSONファイル）へ変換
    const blob = new Blob([ JSON.stringify(targetData) ], { type: 'application\/json' });

    // ファイル出力時のオプションを設定
    const saveOptions: SaveFilePickerOptions = { 
      suggestedName : `${ fileName }.json`,
      types         : [ { accept : { "application/json": [ ".json" ] } } ]
    }

    Utils.writeBlob(blob, saveOptions);

  }

    /**
   * JavaScriptオブジェクトをJSONファイルへ変換し、指定された名前のファイルを端末へダウンロードするメソッド
   * File System Access APIに非対応のブラウザ向けの処理
   * @param targetData JSONファイルへ変換するJavaScriptオブジェクト
   * @param fileName 出力するJSONファイルの名前 拡張子を除いた部分とすること
   */
    static exportJSON_OLD(targetData: Object, fileName: string){

      // JacaScriptオブジェクトをBLOB（JSONファイル）へ変換
      const blob = new Blob([ JSON.stringify(targetData) ], { type: 'application\/json' });
  
      // BLOBをダウンロードするリンク（URL）を作成
      /** Warn:
       *    生成したURLはメモリ内に残存するため、解放処理を実行すること
       */
      const url = URL.createObjectURL(blob);
  
      // HTML aタグのクリックイベントを介してダウンロードを実行
      const anchorElm = document.createElement("a");              // aタグを生成
      anchorElm.setAttribute("href", url);                        // aタグのリンク先へ生成したURLを設定
      anchorElm.setAttribute("download", `${ fileName }.json`);   // ダウンロード実行時のファイル名を設定
      anchorElm.click();                                          // クリックイベントを発火しダウンロードを実行
  
      // URLをメモリから解放
      window.URL.revokeObjectURL(url);
  
    }

  /**
   * JSONファイルを読み込みJavaScriptオブジェクトへ変換し返すメソッド
   * @returns 
   */
  static async importJSON(): Promise<Object>{

    // ユーザーからの入力ファイルを取得
    const file: File = await Utils.getFile();

    // ファイルを読込み（入力ファイルを文字列へと解読）
    const jsonText: string = await Utils.readTextFile(file);

    // JSON文字列からJavaScriptオブジェクトを生成
    /** ToDo: JSONとして成立しているファイルか検証する処理を追加 */
    const jsObject: Object = JSON.parse(jsonText);

    return jsObject;
  }

  static iDBTest(){
    /**
    const successCallback = (iDB: IDBDatabase) => {
      console.log(iDB);
    }
    IDBHandler.manipulate(successCallback);
     */
  }

  static iDBCreateTest(jottingToSave: Array<Jotting>){
    IDBHandler.createRecords("jotting", jottingToSave);
  }

  static iDBReadAllTest(func: (data: any) => void){
    const successCallback = (data: any) => {
      func(data);
    }
    IDBHandler.readAllRecords("jotting", successCallback);
  }

  static iDBReadTargetTest(tardetKeys: Array<string>, func: (data: any) => void){
    const successCallback = (data: any) => {
      func(data);
    }
    IDBHandler.readTargetRecordsByKey("jotting", tardetKeys, successCallback);
  }

}

export default JGEngine