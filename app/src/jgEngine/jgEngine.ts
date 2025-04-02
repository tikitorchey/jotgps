import Utils from "./utils";
import IDBHandler from "./dataPerpetuations/iDBHandler";
import Jotting from "./types/jotting";
import { StoreName } from "./dataPerpetuations/iDBSchema";

const IDB_STORENAME_JOTTING: StoreName = "jotting";

export class JGEngine{

  /**
   * 端末のGPS座標（緯度経度系）を取得する関数
   * 座標取得に成功/失敗時に各コールバックを実行する
   * 
   * @remarks
   *  GPS座標の取得にはGeolocationAPIを利用
   *  GeolocationAPIの利用はsecure origins(https://goo.gl/Y0ZkNV)からの呼び出しが必要となる
   *  例えばhttps通信やlocalhostでの接続がこれに該当する
   * 
   */
  static getGPSCoords(successCallback: PositionCallback, errorCallback?: PositionErrorCallback): void{

    // ブラウザのGeoAPI対応可否の確認
    if("geolocation" in navigator){

      // 呼び出し元からエラーコールバックが設定されていない場合は、汎用のエラーハンドリングを設定する
      if(!errorCallback){
        errorCallback = (error: GeolocationPositionError) => {
          console.debug(error);
        }
      }

      // GeolocationAPIより現在地の座標を取得
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    }else{
      alert("ご利用のブラウザはGPS座標の所得に対応していない可能性があります。");
    }
    
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

  static iDBCreateJottings(jottingToSave: Array<Jotting>){
    IDBHandler.createRecords(IDB_STORENAME_JOTTING, jottingToSave);
  }

  static iDBReadAllJottings(func: (data: any) => void){
    const successCallback = (data: any) => {
      func(data);
    }
    IDBHandler.readAllRecords(IDB_STORENAME_JOTTING, successCallback);
  }

  static iDBReadTargetJottings(tardetKeys: Array<string>, func: (data: any) => void){
    const successCallback = (data: any) => {
      func(data);
    }
    IDBHandler.readTargetRecordsByKey(IDB_STORENAME_JOTTING, tardetKeys, successCallback);
  }

}

export default JGEngine