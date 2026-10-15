import {hotels} from '../data/hotels'
const wait=(ms=450)=>new Promise(resolve=>setTimeout(resolve,ms))
const cache=new Map()
const readReservations=()=>JSON.parse(localStorage.getItem('staywise-reservations')||'[]')
const writeReservations=data=>localStorage.setItem('staywise-reservations',JSON.stringify(data))
export const clearApiCache=()=>cache.clear()
export async function apiRequest(path,{method='GET',body}={}){
  const cacheKey=`${method}:${path}`
  if(method==='GET'&&cache.has(cacheKey)) return cache.get(cacheKey)
  await wait()
  let response
  if(path==='/hotels'&&method==='GET') response={data:hotels}
  else if(path.startsWith('/hotels/')&&method==='GET'){const hotel=hotels.find(item=>item.id===path.split('/')[2]);if(!hotel)throw new Error('Hotel not found');response={data:hotel}}
  else if(path==='/reservations'&&method==='GET') response={data:readReservations()}
  else if(path==='/reservations'&&method==='POST'){const reservation={...body,id:`SW-${Date.now().toString().slice(-6)}`,status:'Confirmed',createdAt:new Date().toISOString()};const next=[reservation,...readReservations()];writeReservations(next);response={data:reservation}}
  else if(path.startsWith('/reservations/')&&method==='PATCH'){const id=path.split('/')[2];const next=readReservations().map(item=>item.id===id?{...item,...body}:item);writeReservations(next);response={data:next.find(item=>item.id===id)}}
  else if(path.startsWith('/reservations/')&&method==='DELETE'){const id=path.split('/')[2];const next=readReservations().filter(item=>item.id!==id);writeReservations(next);response={data:{id}}}
  else throw new Error('API endpoint not found')
  if(method==='GET') cache.set(cacheKey,response)
  else cache.clear()
  return response
}
