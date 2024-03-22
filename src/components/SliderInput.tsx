import { useState, Ref, useRef, CSSProperties } from "react";
import { Slider, InputNumber, Flex } from "antd";
import { SyntheticEventHandler } from "react-d3-tree";

interface SliderInputProps {
  min: number;
  max: number;
  defaultValue: number;
  onChange: SyntheticEventHandler;
  style: {
    slider?: CSSProperties;
    input?: CSSProperties;
  };
}

const DefaultStyle = {
  slider: {
    width: 150,
    marginRight: 10,
  },
  input: {}
};

function SliderInput({ min, max, defaultValue, onChange, style }: SliderInputProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef: Ref<HTMLInputElement> = useRef(null);

  return (
    <>
      {/* Dummy element for event firing */}
      <input type="number" ref={inputRef} hidden={true} value={value} onClick={onChange} readOnly />
      <Flex align="center">
        <Slider min={min} max={max} value={value} style={{ ...DefaultStyle.slider, ...style.slider }} onChange={(value) => {
          setValue(value);
          setTimeout(() => inputRef.current!.click()); // manually trigger event
        }} />
        <InputNumber min={min} max={max} value={value} style={{ ...DefaultStyle.input, ...style.input}} onChange={(value) => {
          setValue(value ?? 0);
          setTimeout(() => inputRef.current!.click()); // manually trigger event
        }} />
      </Flex>
    </>
  );
}

SliderInput.defaultProps = {
  min: 0,
  max: 100,
  defaultValue: 0,
  onChange: () => { },
  style: {}
} as SliderInputProps;

export default SliderInput;