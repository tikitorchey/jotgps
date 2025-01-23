import React, { useEffect, useState } from "react";

/**
 * Outline	: XXXするComponent
 * Logic		: - AAAをBBBにする
 *            - 親ComponentからCCCを受け取り、DDDとしたものを子Componentに渡す
 * View			: - KKKをリスト表示する
 */

// Type Declaration of Props
type Props = {
  sampleProp ?: any;
}

export const FCTemplate: React.FC<Props> = ({ sampleProp }) => {

  // ___ state ___ ___ ___ ___ ___
  const [ sampleState, setSampleState ] = useState<string>('This is SampleState');

  // ___ use effect ___ ___ ___ ___ ___
  useEffect( () => { console.log(sampleState) }, [ sampleState ] );

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSampleState(newValue);
  };

  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }
  
  const onClickResetButton = () => {
    const initialVal = 'This is SampleState';
    setSampleState(initialVal);
  }

  return (
    <div>
      <h2>{ FCTemplate.name }</h2>
      <h2>{ sampleProp }</h2>
      <button onClick = { test }> Test </button>
      <button onClick = { onClickResetButton }> Reset</button>
      <input
        type      = "text"
        value     = { sampleState }
        onChange  = { handleChange }
      />
    </div>
  );
};

export default FCTemplate