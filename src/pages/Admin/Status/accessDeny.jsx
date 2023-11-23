import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './accessDeny.module.scss';
const cx = classNames.bind(styles);
function AccessDeny() {
    return (
        <>
            <div className={cx('w3-display-middle')} >
                <h1 className={cx('w3-jumbo','w3-animate-top', 'w3-center')}   style={{ color: 'red' }}>
                    <code>Access Denied</code>
                </h1>
                <hr className={cx('w3-border-white','w3-animate-left')}style={{ margin: 'auto', width: '50%', fontSize:'32px' }} />
                <h3  className={cx('w3-center','w3-animate-right')} style={{  fontSize:'32px' }}>Bạn không có quyền.</h3>
                <h3 className={cx('w3-center','w3-animate-zoom')} style={{  fontSize:'32px' }}>🚫🚫🚫🚫</h3>
                <h6 className={cx('w3-center','w3-animate-zoom')} style={{ color: 'red' ,fontSize:'32px'}}>
                    error code:403 forbidden
                </h6>
                <Link to={'/'}>
                    <h3 className={cx('w3-center','w3-animate-zoom')} style={{  fontSize:'32px' }}>Trang chủ</h3>
                </Link>
            </div>
        </>
    );
}

export default AccessDeny;
