import { useEffect, useRef } from 'react';
import {elements} from '@code-wallet/elements';

const PaymentButton = () => {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const {button} = elements.create('button', {
      currency: 'usd',
      destination: 'E8otxw1CVX9bfyddKu3ZB3BVLa4VVF9J7CTPdnUwT9jR',
      amount: 0.05,
    });
    if(!button) return;
    button.mount(el.current!);
  }, []);

  return (
    <div ref={el} className="custom-button-container" />
  );
};

export default PaymentButton;
