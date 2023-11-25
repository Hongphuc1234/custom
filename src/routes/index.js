// Layouts

// Pages
import Home from '~/pages/Home';
import Cart from '~/pages/Cart';
import Login from '~/pages/Login/index';
import Register from '~/pages/Register/index';
import Calendar from '~/pages/Admin/scenes/calendar/calendar';
import Form from '~/pages/Admin/scenes/form/user';
import FormService from '~/pages/Admin/scenes/form/service';
import EditForm from '~/pages/Admin/scenes/form/editUser';
import EditFormService from '~/pages/Admin/scenes/form/editService';
import Dashboard from '~/pages/Admin/scenes/dashboard/index';
import BookServiceContent from '~/pages/BookServiceContent';
import Service from '~/pages/Service';
import ServiceEx from '~/pages/ServiceEx/ServiceEx';
import ServiceDetail from '~/pages/ServiceDetail';
import UserHistory from '~/pages/Admin/scenes/user-history';
import HistoryBooking from '~/pages/Admin/scenes/history';
import AccessDeny from '~/pages/Admin/Status/accessDeny';
import NotFound from '~/pages/Admin/Status/NotFound';
import MailPage from '~/pages/ForgotPass/mailPage';
import ForgotPage from '~/pages/ForgotPass/forgotPage';
import Profile from '~/pages/Profile';
import DataService from '~/pages/Admin/scenes/service';
import BookOff from '~/pages/Receptionist/BookOff';
import DataUser from '~/pages/Admin/scenes/team';
import AcceptBooking from '~/pages/Receptionist/AcceptBooking';
import Contact from '~/pages/Contact';
import ResetPage from '~/ResetPass/ResetPage';
import HistoryPost from '~/pages/Admin/scenes/listPost';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/cart', component: Cart },
    { path: '/bookservice', component: BookServiceContent },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/service', component: Service },
    { path: '/serviceExample', component: ServiceEx },
    { path: '/services/:id', component: ServiceDetail },
    { path: '/dataService', component: DataService, admin: true },
    { path: '/calendar', component: Calendar, admin: true },
    { path: '/form', component: Form, admin: true },
    { path: '/dashboard', component: Dashboard, admin: true },
    { path: '/history', component: HistoryBooking, admin: true },
    { path: '/formService', component: FormService },
    { path: '/editUser/:id', component: EditForm, admin: true },
    { path: '/editService/:id', component: EditFormService, admin: true },
    { path: '/accessDeny', component: AccessDeny, layout: null },
    { path: '/404', component: NotFound, layout: null },
    { path: '/profile', component: Profile },
    { path: '/user-history', component: UserHistory },
    { path: '/mail', component: MailPage, layout: null },
    { path: '/reset', component: ForgotPage, layout: null },
    { path: '/bookOff', component: BookOff },
    { path: '/dataUser', component: DataUser, admin: true },
    { path: '/accept', component: AcceptBooking },
    { path: '/contact', component: Contact },
    { path: '/resetpage', component:ResetPage ,layout:null },
    { path: '/listpost', component:HistoryPost,layout:null },
    { path: '/*', component: NotFound, layout: null },
];


const privateRoutes = [];

export { publicRoutes, privateRoutes };
