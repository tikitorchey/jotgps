import React, { Component } from 'react';

/**
 * Outline	: XXXするComponent
 * Logic		: - AAAをBBBにする
 *            - 親ComponentからCCCを受け取り、DDDとしたものを子Componentに渡す
 * View			: - KKKをリスト表示する
 */
export class ClassComponentTemplate extends Component {

  constructor(props){
    super(props);
    this.test = this.test.bind(this);
    this.state = { test : 'test' };
  }


  render(){
    return(
      <div>
        <span> { this.constructor.name } </span>
        <button onClick = { this.test }> TEST </button>
      </div>
    );
  }


	// ___ ライフサイクル ___ ___ ___ ___ ___

  // コンポーネントがマウント(配置)される直前に呼び出されるメソッド
  componentWillMount(){

  }


  // コンポーネントがマウント(配置)された直前に呼び出されるメソッド
	componentDidMount(){

	}

  
  // コンポーネントが受け取るpropsが変化した場合に呼び出されるメソッド
  componentWillReceiveProps(){

  }


  // stateもしくはporpsが変更された際のコンポーネントの再描画前に呼び出されるメソッド
  shouldComponentUpdate(){

  }


  // コンポーネントの再描画前に呼び出されるメソッド
  componentWillUpdate(){
    
  }


  // コンポーネントが再描画されたタイミングで呼び出されるメソッド
  componentDidUpdate(){

  }

  
  // コンポーネントが破棄(アンマウント)される前に実行されるメソッド
  componentWillUnmount(){
    
  }


	// ___ イベントハンドラ ___ ___ ___ ___ ___

  test(){
		console.log('test');
	} 

  // ___ メソッド ___ ___ ___ ___ ___

}
