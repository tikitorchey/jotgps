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

  /**
   *  ローカル端末へファイル（Blobデータ）を保存するメソッド
   * @param blob ファイル
   * @param saveOptions ファイル出力先ディレクトリを設定するダイアログへ設定するオプション
   *  - suggestedName  : 出力ファイル名のプレイスホルダー
      - types          : 出力ファイルとして許容する拡張子
   */
  static async writeBlob(blob: Blob, saveOptions: SaveFilePickerOptions): Promise<void>{

    // 出力先のローカルディレクトリを選択するダイアログを表示
    /** ToDo: DOMExceptionのエラーハンドリングを実装
     *    ディレクトリ選択をキャンセルした場合にエラーが発生する
     */
    const fileHandle: FileSystemFileHandle = await window.showSaveFilePicker(saveOptions);

    // ファイルを出力
    const fileStream: FileSystemWritableFileStream = await fileHandle.createWritable();
    await fileStream.write(blob);
    await fileStream.close();
  }

}

export default Utils;