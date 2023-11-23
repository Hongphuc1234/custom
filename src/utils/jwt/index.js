import { logoutSuccess } from '../store/authSlice';
import { store } from '~/utils/store/store';
function isAdmin(token) {
    if (token) {
        const role = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(role.exp * 1000);

        if (expirationDate <= new Date()) {
            store.dispatch(logoutSuccess());
            return false;
        }
        if (role.roles.includes('ROLE_ADMIN')) {
            return true;
        }
    }
    return false;
}
function isReceptionist(token) {
    if (token) {
        const role = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(role.exp * 1000);

        if (expirationDate <= new Date()) {
            store.dispatch(logoutSuccess());
            return false;
        }
        if (role.roles.includes('ROLE_RECEPTIONIST')) {
            return true;
        }
    }
    return false;
}
export { isReceptionist };
export default isAdmin;
