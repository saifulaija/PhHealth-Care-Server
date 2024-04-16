import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { sslServices } from "../ssl/ssl.service";
import { paymentStatus } from "@prisma/client";

const initPayment = async (appointmentId:string) => {
  const paymentData=await prisma.payment.findFirstOrThrow({
    where:{
      appointmentId
    },
    include:{
      appoinment:{
        include:{
          patient:true
        }
      }
    }
  })
  const initPaymentData={
    amount:paymentData.amount,
    tranasctionId:paymentData.tranasctionId,
    name:paymentData.appoinment.patient.name,
    email:paymentData.appoinment.patient.email,
    address:paymentData.appoinment.patient.address,
    phoneNumber:paymentData.appoinment.patient.contactNumber
  }

  const result = await sslServices.initPayment(initPaymentData)
 return {
  paymentUrl:result.GatewayPageURL
 }
 
};

//ip listener

// amount=1150.00&bank_tran_id=151114130739MqCBNx5&card_brand=VISA&card_issuer=BRAC+BANK%2C+LTD.&card_issuer_country=Bangladesh&card_issuer_country_code=BD&card_no=432149XXXXXX0667&card_type=VISA-Brac+bank¤cy=BDT&status=VALID&store_amount=1104.00&store_id=phhea661e4dc1c0896&tran_date=2015-11-14+13%3A07%3A12&tran_id=5646dd9d4b484&val_id=151114130742Bj94IBUk4uE5GRj&verify_sign=57e5932b1c2925f6556c23821ff95c57&verify_key=amount%2Cbank_tran_id%2Ccard_brand%2Ccard_issuer%2Ccard_issuer_country%2Ccard_issuer_country_code%2Ccard_no%2Ccard_type%2Ccurrency%2Cstatus%2Cstore_amount%2Cstore_id%2Ctran_date%2Ctran_id%2Cval_id

const validatePayment=async(payload:any)=>{
// if(!payload || !payload.status || !(payload.status==='VALID')){
//   return {
//     message:'Invalid payment'
//   }
// }



// const response=await sslServices.validatePayment(payload)
// if (response?.status !== "VALID") {
//   return {
//     message: "Invalid Failed",
//   };
// }
const response = payload


await prisma.$transaction(async(tx)=>{
 const updatedPaymentData= await tx.payment.update({
    where:{
      tranasctionId:response.tran_id,
    },
    data:{
      status:paymentStatus.PAID,
      paymentGateWayData:response
    }
  })
  await tx.appoinment.update({
    where:{
id:updatedPaymentData.appointmentId
    },
    data:{
      paymentStatus:paymentStatus.PAID
    }
  })
})
return{
  message:'Payment success!'
}



}

export const paymentServices = {
  initPayment,validatePayment
};
