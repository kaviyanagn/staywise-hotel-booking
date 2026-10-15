import {BrowserRouter,Routes,Route,Navigate,useLocation} from 'react-router-dom';
import {Suspense,lazy,Component} from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import {useAuth} from './context/AuthContext';

const HotelDetail=lazy(()=>import('./pages/HotelDetail'));
const BookingPage=lazy(()=>import('./pages/Booking'));
const AuthBookings=lazy(()=>import('./pages/AuthBookings'));

function Guard({children}){const {user}=useAuth();const location=useLocation();return user?children:<Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace/>}
class ErrorBoundary extends Component{constructor(props){super(props);this.state={error:null}}static getDerivedStateFromError(error){return {error}}render(){return this.state.error?<Boundary error={this.state.error}/>:this.props.children}}
function Boundary({error}){return <div className="page-shell"><div className="error-box" role="alert"><strong>We hit a small bump.</strong><span>{error.message}</span><a href="/" className="button">Back home</a></div></div>}
function LoadingRoute(){return <div className="loading" role="status" aria-live="polite">Loading page...</div>}
export default function App(){return <BrowserRouter><Layout><ErrorBoundary><Suspense fallback={<LoadingRoute/>}><Routes><Route path="/" element={<Home/>}/><Route path="/hotels" element={<Hotels/>}/><Route path="/hotel/:id" element={<HotelDetail/>}/><Route path="/booking/room" element={<Navigate to="/booking/guest" replace/>}/><Route path="/booking/guest" element={<Guard><BookingPage/></Guard>}/><Route path="/booking/summary" element={<Guard><BookingPage/></Guard>}/><Route path="/checkout" element={<Guard><BookingPage/></Guard>}/><Route path="/login" element={<AuthBookings/>}/><Route path="/bookings" element={<Guard><AuthBookings/></Guard>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense></ErrorBoundary></Layout></BrowserRouter>}
