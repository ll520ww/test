import { useEffect, useState } from "react";

export const IfControl = (props: {
  when: boolean;
  children: any;
  //毫秒
  delay?: number;
}): JSX.Element => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (props.when && props.delay) {
      setTimeout(() => {
        setShow(props.when);
      }, props.delay);
    } else {
      setShow(props.when);
    }
  }, [props.when]);

  if (show) {
    return props.children;
  }

  return null as any;
};
export const IfElseControl = (props: {
  when: boolean;
  children: any;
  else: JSX.Element;
}): JSX.Element => {
  if (props.when) {
    return props.children;
  }

  return props.else;
};

export const ForControl = <I extends any>(props: {
  list: I[];
  children: (item: I, index: number) => React.ReactNode;
}): JSX.Element => {
  return props.list.map((item, index) => {
    return props.children(item, index);
  }) as any;
};
