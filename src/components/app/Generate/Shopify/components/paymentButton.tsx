import { useEffect, useRef } from 'react';
import {elements} from '@code-wallet/elements';
import { MAKE_UI_API, MAKE_UI_URL } from '../../../constants';

interface Props {
  setIntentId: (e:any) => void;
}

const PaymentButton = ({ setIntentId }: Props) => {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const {button} = elements.create('button', {
      currency: 'usd',
      destination: '5YByVY9AJ62Nq2RrUkdxwAFkP5UadMmiE6RKHmCPniNv',
      amount: 0.05
    });

    if(!button) return;

    button.on('success', async (e:any) => {
      setIntentId(e?.intent);
    });

    button.on('invoke', async () => {
      const res = await fetch(`${MAKE_UI_URL}/api/create-intent`, { 
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: MAKE_UI_API
        }
      });
      const { clientSecret } = await res.json();
      button.update({ clientSecret });
    })
    button.mount(el.current!);
  }, []);

  return (
    <div ref={el} className="custom-button-container" />
  );
};

export default PaymentButton;
