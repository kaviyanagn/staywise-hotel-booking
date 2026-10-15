import {configureStore,createSlice} from '@reduxjs/toolkit'
const saved=JSON.parse(localStorage.getItem('staywise-booking')||'null')
const initial={hotel:saved?.hotel||null,room:saved?.room||null,checkIn:saved?.checkIn||'2026-11-12',checkOut:saved?.checkOut||'2026-11-15',guests:saved?.guests||2,guest:saved?.guest||{name:'',email:'',phone:''},payment:saved?.payment||'card'}
const bookingSlice=createSlice({name:'booking',initialState:initial,reducers:{selectHotel:(s,a)=>{s.hotel=a.payload;s.room=null},selectRoom:(s,a)=>{s.room=a.payload},updateDates:(s,a)=>{s.checkIn=a.payload.checkIn;s.checkOut=a.payload.checkOut},updateGuests:(s,a)=>{s.guests=a.payload},updateGuest:(s,a)=>{s.guest={...s.guest,...a.payload}},updatePayment:(s,a)=>{s.payment=a.payload},clearBooking:()=>initial}})
export const {selectHotel,selectRoom,updateDates,updateGuests,updateGuest,updatePayment,clearBooking}=bookingSlice.actions
export const store=configureStore({reducer:{booking:bookingSlice.reducer},middleware:getDefault=>getDefault().concat(storeAPI=>next=>action=>{const result=next(action); localStorage.setItem('staywise-booking',JSON.stringify(storeAPI.getState().booking)); return result})})
export const getNights=(a,b)=>Math.max(1,Math.ceil((new Date(b)-new Date(a))/86400000))
export const selectTotals=s=>{const b=s.booking,nights=getNights(b.checkIn,b.checkOut),roomCost=(b.room?.price||0)*nights,taxes=Math.round(roomCost*.12),serviceFee=roomCost?499:0;return {nights,roomCost,taxes,serviceFee,total:roomCost+taxes+serviceFee}}
