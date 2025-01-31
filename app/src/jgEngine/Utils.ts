export class Utils{

  /** ToDo:
   * Utilsというクラスおよびフォルダは利用目的が判然としないため、
   * 避けることが望ましい。要改修。
   */

  constructor(){

  }

  /**
   * ファイルピッカーを表示し、ユーザーが選択したファイルを呼び出し元に返すメソッド
   * @returns ユーザーが選択したファイル
   */
  static async getFile(): Promise<File> {

    // ToDo: ファイルを選択せずにファイルピッカーを閉じた場合のハンドリングを実装

    // ファイルピッカーを開き、結果を分解して最初のハンドルを取り出す
    /** Ref:
     *    引用元: https://developer.mozilla.org/ja/docs/Web/API/File_System_API
     */
    const [ fileHandle ] = await window.showOpenFilePicker();
    const file           = await fileHandle.getFile();
    return file;
  }

  /**
   * 
   * @param file 
   * @returns 
   */
  static async readTextFile(file: File): Promise<string>{

    /** ToDo: 引数として渡されたファイルのバリデーションチェックの実装
     * 
     */
    const arrayBuffer : ArrayBuffer = await file.arrayBuffer();
    
    const textDecoder : TextDecoder = new TextDecoder();
    const text        : string      = textDecoder.decode(arrayBuffer);

    return text;
  }

}

export default Utils;