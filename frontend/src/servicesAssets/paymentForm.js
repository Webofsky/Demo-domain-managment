import React, { useState, useEffect } from "react";
import { IconButton, TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

const PaymentForm = ({ onAddPayment, service }) => {
  const [paymentText, setPaymentText] = useState('');
  const [paymentCost, setPaymentCost] = useState(0);
  const [paid, setPaid] = useState(0)

  const handleAddPayment = () => {
    const cost = parseFloat(paymentCost)
    if (paymentText && !isNaN(cost)) {
      onAddPayment(paymentText, cost);
      setPaid(prevState=>prevState+ cost)
      setPaymentText('');
      setPaymentCost('');
    }
  };

  useEffect(() => {
    const totalPaid = service.paid.reduce((total, payment) => total + payment.installment, 0)
    setPaid(totalPaid)
  },[service.paid])


  return (
    <>
    <h1 className='text-bl ml-10 text-emerald-800 text-xl pt-5'>Cost: {service.toPay} zł</h1>
    {service.toPay-paid<=0 ? 
    <h1 className='text-bl ml-10 text-xl  text-emerald-800 pt-5'>Paid: {paid} zł</h1>
  :
  <h1 className='text-bl ml-10 text-xl pt-5'>Paid: {paid} zł</h1>
  }
    <div className="flex flex-col w-fit p-3 border ml-12">
      {service.paid.map((payment, index) => {
          return <h2 key={index}>{payment.title} | {payment.installment} zł</h2>
      })}
      <div className="my-4 flex flex-row items-center">
        <TextField
          label="New Payment"
          variant="standard"
          value={paymentText}
          required
          onChange={(e) => setPaymentText(e.target.value)}
        />
        <TextField
          label="Cost"
          variant="standard"
          type="number"
          required
          value={paymentCost}
          onChange={(e) => setPaymentCost(e.target.value)}
        />
        <IconButton color="primary" onClick={handleAddPayment}>
          <AddCircleIcon />
        </IconButton>
      </div>
    </div>
    <h1 className='text-bl pl-10 text-xl py-5'>Left to pay: {service.toPay - paid > 0 ? service.toPay-paid : <PriceCheckIcon/>}</h1>     
    </>
    
  );
};

export default PaymentForm;